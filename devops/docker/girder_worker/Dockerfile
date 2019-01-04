FROM girder/girder_worker:latest-py3

USER root

RUN apt-get update && apt-get install -y sudo

COPY ./devops/docker/girder_worker/entrypoint.sh /

RUN chown worker:worker /entrypoint.sh

COPY ./devops/docker/wait-for-it.sh /

RUN chown worker:worker /wait-for-it.sh

ENV PYTHON_BIN=python3

ENTRYPOINT ["/wait-for-it.sh", "rabbit:5672", "--", "/entrypoint.sh"]
