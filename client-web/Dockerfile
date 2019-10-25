FROM node:11.4.0-stretch

WORKDIR /usr/src/app/web

COPY package*.json /usr/src/app/web/
RUN npm i
RUN npm i -g @angular/cli
COPY . /usr/src/app/web

EXPOSE 8081
CMD [ "npm", "start" ]
