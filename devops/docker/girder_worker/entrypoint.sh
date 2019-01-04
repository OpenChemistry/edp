#!/bin/bash

PYTHON=${PYTHON_BIN:-python}

# Hack to make sure docker.sock has a real group, and that the
# 'worker' user is apart of that group.
if [ -e /var/run/docker.sock ]; then
    if [ $(stat -c %G /var/run/docker.sock) == 'UNKNOWN' ]; then
        groupadd -g $(stat -c %g /var/run/docker.sock) dockermock
        usermod -aG dockermock worker
    else
        usermod -aG $(stat -c %G /var/run/docker.sock) worker
    fi
fi

sudo --preserve-env -u worker $PYTHON -m girder_worker -l info
