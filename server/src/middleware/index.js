/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import fs from 'fs';

module.exports = (router) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return;
    const name = file.substr(0, file.indexOf('.'));
    require(`./${name}`)(router);
  });
};
