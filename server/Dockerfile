FROM node:11.4.0-stretch

WORKDIR /usr/src/app

COPY package.json ./
RUN npm i
RUN npm i -g nodemon apidoc
RUN npm i --save-dev @babel/core @babel/cli @babel/preset-env @babel/node babel-eslint eslint eslint-config-airbnb-base eslint-plugin-import
COPY . .
EXPOSE 8080

CMD ["npm","start"]
