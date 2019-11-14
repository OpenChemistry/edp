import csv
import sys
import statistics as stats


def summarize(filepath):
    cycle_discharge = {}
    with open(filepath) as fp:
        reader = csv.reader(fp)

        headers = next(reader)

        cycle_index_column = headers.index('Cycle_Index')
        discharge_capacity_column = headers.index('Discharge_Capacity')

        for row in reader:
            cycle_index = int(float(row[cycle_index_column]))
            max_discharge_capacity = cycle_discharge.get(cycle_index, -sys.float_info.max)
            discharge_capacity = float(row[discharge_capacity_column])
            if discharge_capacity > max_discharge_capacity:
                cycle_discharge[cycle_index] = discharge_capacity

    cycle_indices = sorted(cycle_discharge.keys())
    max_discharge_capacities = [None] * len(cycle_indices)
    for cycle_index, max_value in cycle_discharge.items():
        max_discharge_capacities[cycle_indices.index(cycle_index)] = max_value

    if None in max_discharge_capacities:
        raise Exception('Missing max discharge capacity.')

    # Now calculate the range min(max_discharge_capacities) -> mean + 2 sigma, this is done to
    # remove discharge spikes.
    if len(max_discharge_capacities) > 1:
        mean = stats.mean(max_discharge_capacities)
        stdev = stats.stdev(max_discharge_capacities, mean)
        range = [min(max_discharge_capacities), mean + stdev*2]
    else:
        range = [max_discharge_capacities[0], max_discharge_capacities[0]]

    return {
        'Discharge capacity vs cycle number': {
            'x': {
                'label': 'Cycle number',
                'data': cycle_indices
            },
            'y': {
                'label': 'Discharge capacity (Ah)',
                'data': max_discharge_capacities,
                'range': range
            }
        }
    }
