FROM node:14.17.3

LABEL maintainer="froala_git_travis_bot@idera.com"

ARG PackageName
ARG PackageVersion
ARG NexusUser
ARG NexusPassword


WORKDIR /app/
COPY . .

RUN apt update -y \
    && apt install -y jq unzip wget

RUN wget --no-check-certificate --user ${NexusUser}  --password ${NexusPassword} https://nexus.tools.froala-infra.com/repository/Froala-npm/${PackageName}/-/${PackageName}-${PackageVersion}.tgz

RUN npm install
RUN npm install -g bower
EXPOSE 4200
CMD ["npm","start"]

