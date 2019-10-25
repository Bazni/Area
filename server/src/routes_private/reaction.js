import { prune, toLowerCaseObject } from '../utils/utils';

const { Reaction, Service } = global.app.get('models');

module.exports = (router, middleware) => {
  /**
   * @api {get} /reactions Get reactions list
   * @apiName GetReactions
   * @apiGroup Reactions
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiSuccess (Success 200) {Object[]} reactions Reaction informations.
   * @apiSuccess (Success 200) {String} reactions.uuid Reaction UUID.
   * @apiSuccess (Success 200) {String} reactions.name Reaction name.
   * @apiSuccess (Success 200) {String} reactions.description Reaction description.
   * @apiSuccess (Success 200) {Object} reactions.config Reaction configuration template.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/reactions')
    .all(middleware)
    .get((req, res) => {
      Reaction.findAll()
        .then(reactions => res.status(200).json(reactions))
        .catch(e => res.status(500).json({
          errorMessage: `Database error: ${e}`,
        }));
    });

  /**
   * @api {get} /reactions/:uuid Get reactions list by service
   * @apiName GetReactionsByServiceUUID
   * @apiGroup Reactions
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiParam {String} uuid Service UUID.
   *
   * @apiSuccess (Success 200) {Object[]} reactions Reaction informations.
   * @apiSuccess (Success 200) {String} reactions.uuid Reaction UUID.
   * @apiSuccess (Success 200) {String} reactions.name Reaction name.
   * @apiSuccess (Success 200) {String} reactions.description Reaction description.
   * @apiSuccess (Success 200) {Object} reactions.config Reaction configuration template.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/reactions/:id')
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
          Reaction.findAll({
            where: {
              '$Services.uuid$': req.params.id,
            },
            include: [{
              model: Service,
            }],
          }).then(reactions => res.status(200)
            .json(prune(toLowerCaseObject(JSON.parse(JSON.stringify(reactions))),
              ['serviceaction', 'servicereaction', 'services'])))
            .catch(e => res.status(500).json({
              errorMessage: `Database error: ${e}`,
            }));
        }
      });
    });
};
