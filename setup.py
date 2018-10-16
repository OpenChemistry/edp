from setuptools import setup, find_packages

setup(
    name='edp',

    version='0.0.1',

    description='A platform for the ingestion and management of experimental data.',
    long_description='A platform for the ingestion and management of experimental data.',

    url='https://github.com/OpenChemistry/edp',

    author='Kitware Inc',

    license='BSD 3-Clause',

    classifiers=[
        'Development Status :: 3 - Alpha',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.5',
    ],

    keywords='',

    packages=find_packages(),
    install_requires=[
        'girder_client',
        'click'
    ],
    entry_points= {
        'console_scripts': [
            'edp=edp:cli'
        ]
    }
)
