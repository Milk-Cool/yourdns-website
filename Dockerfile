FROM node:24

# https://stackoverflow.com/a/35774741
COPY package.json /tmp/package.json
RUN cd /tmp && npm install --verbose
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

WORKDIR /opt/app
COPY . .

RUN npm run build
CMD npm run start