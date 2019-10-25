import { prune, toLowerCaseObject } from '../utils/utils';

const { Service, Action, Reaction } = global.app.get('models');

module.exports = (router, middleware) => {
  /**
   * @api {get} /services Get services list
   * @apiName GetServices
   * @apiGroup Services
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiSuccess (Success 200) {Object[]} services Service informations.
   * @apiSuccess (Success 200) {String} services.uuid Service UUID.
   * @apiSuccess (Success 200) {String} services.name Service name.
   * @apiSuccess (Success 200) {String} services.description Service description.
   * @apiSuccess (Success 200) {String} services.photoUrl Service icon URL.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/services')
    .all(middleware)
    .get((req, res) => Service.findAll()
      .then(services => res.status(200).send(services))
      .catch(e => res.status(500).json({
        errorMessage: `Database error: ${e}`,
      })));
  /**
   * @api {get} /serviceswithactions Get services with actions list
   * @apiName GetServicesWithActions
   * @apiGroup Services
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiSuccess (Success 200) {Object[]} services Service informations.
   * @apiSuccess (Success 200) {String} services.uuid Service UUID.
   * @apiSuccess (Success 200) {String} services.name Service name.
   * @apiSuccess (Success 200) {String} services.description Service description.
   * @apiSuccess (Success 200) {String} services.photoUrl Service icon URL.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/serviceswithactions')
    .all(middleware)
    .get((req, res) => Service.findAll({
      include: [{
        model: Action,
      }],
    }).then((services) => {
      const ss = services.filter(s => s.Actions.length > 0);
      res.status(200).send(prune(toLowerCaseObject(JSON.parse(JSON.stringify(ss))),
        ['actions']));
    }).catch(e => res.status(500).json({
      errorMessage: `Database error: ${e}`,
    })));

  /**
   * @api {get} /serviceswithreactions Get services with reactions list
   * @apiName GetServicesWithReactions
   * @apiGroup Services
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiSuccess (Success 200) {Object[]} services Service informations.
   * @apiSuccess (Success 200) {String} services.uuid Service UUID.
   * @apiSuccess (Success 200) {String} services.name Service name.
   * @apiSuccess (Success 200) {String} services.description Service description.
   * @apiSuccess (Success 200) {String} services.photoUrl Service icon URL.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/serviceswithreactions')
    .all(middleware)
    .get((req, res) => Service.findAll({
      include: [{
        model: Reaction,
      }],
    }).then((services) => {
      const ss = services.filter(s => s.Reactions.length > 0);
      res.status(200).send(prune(toLowerCaseObject(JSON.parse(JSON.stringify(ss))),
        ['reactions']));
    }).catch(e => res.status(500).json({
      errorMessage: `Database error: ${e}`,
    })));
};
