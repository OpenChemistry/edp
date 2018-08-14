FROM girder/girder:latest-py3

# Enable proxy support
COPY ./devops/docker/girder/girder.local.conf /girder/girder/conf/girder.local.cfg

COPY ./server/edp /edp

# Install edp plugin
RUN girder-install plugin /edp
