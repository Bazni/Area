import { prune, toLowerCaseObject } from '../utils/utils';

const { Service, Action, Reaction } = global.app.get('models');

module.exports = (router) => {
  /**
   * @api {get} /about.json about.json
   * @apiName about.json
   * @apiGroup About
   *
   * @apiSuccess (Success 200) {Object} client Client informations.
   * @apiSuccess (Success 200) {String} client.ip Client IP address.
   * @apiSuccess (Success 200) {Object} server Server informations.
   * @apiSuccess (Success 200) {String} server.current_time Current time of the server.
   * @apiSuccess (Success 200) {Object[]} server.services Server services informations.
   * @apiSuccess (Success 200) {String} server.services.name Service name.
   * @apiSuccess (Success 200) {Object[]} server.services.actions Service actions.
   * @apiSuccess (Success 200) {String} server.services.actions.name Action name.
   * @apiSuccess (Success 200) {String} server.services.actions.description Action description.
   * @apiSuccess (Success 200) {Object[]} server.services.reactions Service reactions.
   * @apiSuccess (Success 200) {String} server.services.reactions.name Reaction name.
   * @apiSuccess (Success 200) {String} server.services.reactions.description Reaction description.
   *
   */
  router.route('/about.json')
    .get((req, res) => {
      const { ip } = req;
      Service.scope('about').findAll({
        include: [{
          model: Action.scope('about'),
        }, {
          model: Reaction.scope('about'),
        }],
      }).then((services) => {
        res.status(200).json({
          client: {
            host: ip.split(':').pop(),
          },
          server: {
            current_time: Math.floor(new Date() / 1000),
            services: prune(toLowerCaseObject(JSON.parse(JSON.stringify(services))), ['uuid', 'serviceaction', 'servicereaction', 'config', 'function', 'variables']),
          },
        });
      });
    });
};
