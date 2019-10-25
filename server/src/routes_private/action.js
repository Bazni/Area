import { prune, toLowerCaseObject } from '../utils/utils';

const { Action, Service } = global.app.get('models');

module.exports = (router, middleware) => {
  /**
   * @api {get} /actions Get actions list
   * @apiName GetActions
   * @apiGroup Actions
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiSuccess (Success 200) {Object[]} actions Action informations.
   * @apiSuccess (Success 200) {String} actions.uuid Action UUID.
   * @apiSuccess (Success 200) {String} actions.name Action name.
   * @apiSuccess (Success 200) {String} actions.description Action description.
   * @apiSuccess (Success 200) {Object} actions.config Action configuration template.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/actions')
    .all(middleware)
    .get((req, res) => {
      Action.findAll()
        .then(actions => res.status(200).json(actions))
        .catch(e => res.status(500).json({
          errorMessage: `Database error: ${e}`,
        }));
    });

  /**
   * @api {get} /actions/:uuid Get actions list by service
   * @apiName GetActionsByServiceUUID
   * @apiGroup Actions
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiParam {String} uuid Service UUID.
   *
   * @apiSuccess (Success 200) {Object[]} actions Action informations.
   * @apiSuccess (Success 200) {String} actions.uuid Action UUID.
   * @apiSuccess (Success 200) {String} actions.name Action name.
   * @apiSuccess (Success 200) {String} actions.description Action description.
   * @apiSuccess (Success 200) {Object} actions.config Action configuration template.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/actions/:id')
    .all(middleware)
    .get((req, res) => {
      Service.count({
        where: {
          uuid: req.params.id,
        },
      }).then((nb) => {
        if (!nb) {
          res.status(404).json({
            errorMessage: 'Invalid service id',
          });
        } else {
          Action.findAll({
            where: {
              '$Services.uuid$': req.params.id,
            },
            include: [{
              model: Service,
            }],
          }).then((actions) => {
            res.status(200).json(prune(toLowerCaseObject(JSON.parse(JSON.stringify(actions))),
              ['serviceaction', 'servicereaction', 'services']));
          }).catch(e => res.status(500).json({
            errorMessage: `Database error: ${e}`,
          }));
        }
      });
    });

  /**
   * @api {get} /action/:uuid Get action by id
   * @apiName GetActionsByUUID
   * @apiGroup Actions
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiParam {String} uuid Action UUID.
   *
   * @apiSuccess (Success 200) {Object} actions Action informations.
   * @apiSuccess (Success 200) {String} actions.uuid Action UUID.
   * @apiSuccess (Success 200) {String} actions.name Action name.
   * @apiSuccess (Success 200) {String} actions.description Action description.
   * @apiSuccess (Success 200) {Object} actions.config Action configuration template.
   * @apiSuccess (Success 200) {String[]} actions.variables Action variables.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/action/:id')
    .all(middleware)
    .get((req, res) => {
      Action.findAll({
        where: {
          uuid: req.params.id,
        },
      }).then((actions) => {
        if (actions.length > 0) {
          res.status(200).json(actions[0]);
        } else {
          res.status(404).json({
            errorMessage: 'Invalid UUID',
          });
        }
      }).catch(e => res.status(500).json({
        errorMessage: `Database error: ${e}`,
      }));
    });
};
