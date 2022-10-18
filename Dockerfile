FROM node:14.17.3

LABEL maintainer="rizwan@celestialsys.com"

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

RUN rm -rf node_modules/froala-editor/
#RUN wget --no-check-certificate --user ${NexusUser}  --password ${NexusPassword} https://nexus.tools.froala-infra.com/repository/Froala-npm/${PackageName}/-/${PackageName}-${PackageVersion}.tgz
RUN tar -xvf ${PackageName}-${PackageVersion}.tgz

RUN mv package/ node_modules/froala-editor/
RUN rm -rf ${PackageName}-${PackageVersion}.tgz

EXPOSE 4200
CMD ["npm","start"]

