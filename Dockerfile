FROM node:22.17-alpine AS base
# timezone lib
RUN apk add tzdata

ARG user=node
ARG group=node

ENV WORKING_DIR=/usr/app
# Timezone AWS instance
ENV TZ=Europe/Dublin

# Define Working_dir
RUN mkdir -p ${WORKING_DIR}
WORKDIR ${WORKING_DIR}

FROM base as development
COPY . ${WORKING_DIR}

RUN npm install
