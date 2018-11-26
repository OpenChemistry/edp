import os
import json
import glob
import re
import click
from girder_client import GirderClient

from edp.composite.parser.exp import parse_exp
from edp.composite.parser.ana_rcp import parse_ana_rcp
from edp.composite.parser.rawlen import parse_rawlen
from edp.composite.parser.csv import parse_csv
from edp.composite.parser.sample import parse_sample

scalars_to_extract = [
    'Emin.Vrhe',
    'Emax.Vrhe',
    'Jmin.mAcm2',
    'Jmax.mAcm2',
    'Eta.V_ave',
    'Eta(V)',
    'Ewe(V)',
    'Ach(V)',
    'I(A)',
    't(s)'
]

def _ingest_runs(gc, project, composite, dir):
    run_key_regex = re.compile('run__(\d?)')
    # Find the exp file
    exp_paths = glob.glob('%s/**/*.exp' % dir, recursive=True)

    experiments = {}

    technque_file_regex = re.compile('files_technique__(.*)')

    for exp_path in exp_paths:
        with open(exp_path) as f:
            exp = parse_exp(f.read())
        name = exp['name']
        for run in exp['runs']:
            run_key = run['run_key']
            rcp_file = run['rcp_file']

            match = run_key_regex.match(run_key)
            if not match:
                raise Exception('Unable to extract run int')

            run_int = int(match.group(1))

            runs = experiments.setdefault(name, {})

            [run_file] = glob.glob('%s/**/%s' % (dir, rcp_file), recursive=True)
            click.echo('Ingesting run: %s' % run_file)

            with open(run_file) as f:
                run = parse_ana_rcp(f.read())

            technique_files = {}
            for key, value in run.items():
                if key.startswith('files_technique__'):
                    match = technque_file_regex.match(key)
                    technique = match.group(1)

                    run_dir = os.path.dirname(run_file)
                    technique_files[technique] = [os.path.join(run_dir, f) for f in value['pstat_files'].keys()]

            run = {
                'runId': rcp_file,
                'solutionPh': float(run['solution_ph']),
                'plateId': run['plate_id'],
                'electrolyte': run['electrolyte']
            }

            run = gc.post('edp/projects/%s/composites/%s/runs' % (project, composite), json=run)
            run['sampleFiles'] = technique_files
            runs[run_int] = run

    return experiments

def _ingest_loading(gc, project, composite, dir, ana_key, loading_file,
                    elements, experiment, samples, platemap, technique):
    comp_regex = re.compile('([a-zA-Z]+)\.PM.AtFrac')
    sample_regex = re.compile('.*ana__.*_(.*)_rawlen.txt')

    [file_path] = glob.glob('%s/**/%s' % (dir, loading_file), recursive=True)
    click.echo('Ingesting: %s' % file_path)
    with open(file_path) as f:
        loading = parse_csv(f.read())

    sample_numbers = loading['sample_no']
    run_ints = loading['runint']
    plate_ids = loading['plate_id']
    compositions = {}
    for key, value in loading.items():
        match = comp_regex.match(key)
        if match:
            element = match.group(1).lower()
            if element in elements:
                compositions[element] = value

    for i, (plate_id, sample_number, run_int) in enumerate(zip(plate_ids, sample_numbers, run_ints)):
        click.echo('Ingesting sample %s on plate %s' % (sample_number, int(plate_id)))
        if sample_number not in samples.setdefault(plate_id, {}):
            sample_meta = {}
            sample_meta['runId'] = experiment[int(run_int)]['_id']
            sample_meta['sampleNum'] = sample_number

            comp = {}
            sample_meta['composition'] = comp
            for e in compositions.keys():
                comp[e] = compositions[e][i]

            if round(sum(comp.values())) != 1:
                raise click.ClickException('Composite values don\'t add up to 1, for sample: %s' % sample_number)

            scalars = sample_meta.setdefault('scalars', {})
            for s in scalars_to_extract:
                if s in loading:
                    # We need to replace . with the unicode char so we
                    # can store the key in mongo
                    k = s.replace('.', '\\u002e')
                    scalars[k] = loading[s][i]

            sample = gc.post('edp/projects/%s/composites/%s/samples'
                             % (project, composite), json=sample_meta)
            samples.setdefault(plate_id, {})[sample_number] = sample

            # Now look up time series data
            t = technique if technique is not None else '*'
            glob_path = '%s/**/ana__*__Sample%d_*_%s_rawlen.txt' % (dir, sample_number, t)
            sample_files = glob.glob(glob_path, recursive=True)

            timeseries_data = {}
            for sample_file in sample_files:
                match = sample_regex.match(sample_file)
                technique = match.group(1)
                with open(sample_file) as f:
                    timeseries = parse_rawlen(f.read())

                timeseries_data.update(
                    {'%s(%s)' % (key.replace('.', '\\u002e'), technique):value for (key,value) in timeseries.items()}
                )

                # Now look up techinque sample files
                if technique is not None:
                    technique_files = experiment[run_int]['sampleFiles'][technique]
                    prefix = 'Sample%d' % sample_number
                    for file_path in technique_files:
                        name = os.path.basename(file_path)
                        if name.startswith(prefix):
                            with open(file_path, 'rb') as ff:
                                data = ff.read().decode()
                            s = parse_sample(data)
                            for key, value in s.items():
                                if key in scalars_to_extract:
                                    key =  '%s(%s)' % (key.replace('.', '\\u002e'), technique)
                                    timeseries_data[key] = value
            timeseries = {
                'data': timeseries_data
            }
            timeseries = gc.post(
                'edp/projects/%s/composites/%s/samples/%s/timeseries'
                % (project, composite, sample['_id']), json=timeseries)
        else:
            sample = samples.setdefault(plate_id, {}).get(sample_number)

        platemap.setdefault('sampleIds', []).append(sample['_id'])

def _ingest_samples(gc, project, composite, dir, experiments, channel_to_element):

    samples = {}

    ana_files = glob.glob('%s/**/*.ana' % dir, recursive=True)

    for ana_file in ana_files:
        with open(ana_file) as f:
            ana = parse_ana_rcp(f.read())

        experiment_name = ana['experiment_name']

        for key, value in ana.items():
            if key.startswith('ana__'):
                [file_path] = value['files_multi_run']['fom_files'].keys()
                plate_ids = value['plate_ids']
                technique = value.get('technique')
                if 'platemap_comp4plot_keylist' not in value['parameters']:
                    continue

                keylist = value['parameters']['platemap_comp4plot_keylist']

                elements = [channel_to_element[x] for x in keylist]

                platemap = {
                    'plateId': plate_ids,
                    'elements': elements
                }
                _ingest_loading(gc, project, composite, os.path.dirname(ana_file),
                                key, file_path, elements, experiments[experiment_name],
                                samples, platemap, technique)
                # Now create the plate map
                platemap = gc.post('edp/projects/%s/composites/%s/platemaps' % (project, composite), json=platemap)
