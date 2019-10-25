import { prune, hasSameProperty, toLowerCaseObject } from '../utils/utils';

const {
  AREA,
  Action,
  Reaction,
  Service,
} = global.app.get('models');

module.exports = (router, middleware) => {
  /**
   * @api {get} /areas Get AREAS list
   * @apiName GetAREASList
   * @apiGroup AREAS
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiSuccess (Success 200) {Object[]} areas AREA informations.
   * @apiSuccess (Success 200) {String} areas.uuid AREA UUID.
   * @apiSuccess (Success 200) {String} areas.userUUID User UUID.
   * @apiSuccess (Success 200) {String} areas.actionUUID Action UUID.
   * @apiSuccess (Success 200) {String} areas.reactionUUID Reaction UUID.
   * @apiSuccess (Success 200) {Object} areas.actionConfig Action config.
   * @apiSuccess (Success 200) {Object} areas.reactionConfig Reaction config.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/areas')
    .all(middleware)
    .get((req, res) => {
      AREA.findAll({
        where: {
          userUUID: req.decoded.uuid,
        },
      }).then(areas => res.status(200).json(areas))
        .catch(e => res.status(500).json({
          errorMessage: `Database error: ${e}`,
        }));
    });
  /**
   * @api {get} /areas/service/:uuid Get AREAS list by service
   * @apiName GetAREASListByService
   * @apiGroup AREAS
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiSuccess (Success 200) {Object[]} areas AREA informations.
   * @apiSuccess (Success 200) {String} areas.uuid AREA UUID.
   * @apiSuccess (Success 200) {String} areas.userUUID User UUID.
   * @apiSuccess (Success 200) {String} areas.actionUUID Action UUID.
   * @apiSuccess (Success 200) {String} areas.reactionUUID Reaction UUID.
   * @apiSuccess (Success 200) {Object} areas.actionConfig Action config.
   * @apiSuccess (Success 200) {Object} areas.reactionConfig Reaction config.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/areas/service/:uuid')
    .all(middleware)
    .get((req, res) => {
      Action.findAll({
        where: {
          '$Services.uuid$': req.params.uuid,
        },
        include: [{
          model: Service,
        }],
      }).then((actions) => {
        const list = [];
        actions.forEach(a => list.push(a.uuid));
        AREA.findAll({
          where: {
            userUUID: req.decoded.uuid,
            actionUUID: list,
          },
        }).then(areas => res.status(200).json(areas))
          .catch(e => res.status(500).json({
            errorMessage: `Database error: ${e}`,
          }));
      }).catch(e => res.status(500).json({
        errorMessage: `Database error: ${e}`,
      }));
    });

  /**
   * @api {post} /area Create AREA
   * @apiName PostAREA
   * @apiGroup AREAS
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiParam {String} actionUUID Action UUID.
   * @apiParam {String} reactionUUID Reaction UUID.
   * @apiParam {Object} actionConfig Action config.
   * @apiParam {Object} reactionConfig Reaction config.
   *
   * @apiSuccess (Success 200) {Object} area AREA informations.
   * @apiSuccess (Success 200) {String} uuid AREA UUID.
   * @apiSuccess (Success 200) {String} userUUID User UUID.
   * @apiSuccess (Success 200) {String} actionUUID Action UUID.
   * @apiSuccess (Success 200) {String} reactionUUID Reaction UUID.
   * @apiSuccess (Success 200) {Object} actionConfig Action config.
   * @apiSuccess (Success 200) {Object} reactionConfig Reaction config.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/area')
    .all(middleware)
    .post((req, res) => {
      if (!req.body.actionConfig || !req.body.reactionConfig) {
        res.status(400).json({
          errorMessage: `Missing ${req.body.actionConfig ? 'reaction' : 'action'} Configs`,
        });
      } else {
        const actionConfig = JSON.parse(req.body.actionConfig);
        const reactionConfig = JSON.parse(req.body.reactionConfig);
        Action.findByPk(req.body.actionUUID).then((action) => {
          if (!action) return;
          if (!hasSameProperty(action.config, actionConfig)) {
            res.status(400).json({
              errorMessage: 'Invalid action Config',
            });
          } else {
            Reaction.findByPk(req.body.reactionUUID).then((reaction) => {
              if (!reaction) return;
              if (!hasSameProperty(reaction.config, reactionConfig)) {
                res.status(400).json({
                  errorMessage: 'Invalid reaction Config',
                });
              } else {
                AREA.create({
                  userUUID: req.decoded.uuid,
                  actionUUID: req.body.actionUUID,
                  reactionUUID: req.body.reactionUUID,
                  actionConfig,
                  reactionConfig,
                }).then(area => res.status(200).json(area))
                  .catch(e => res.status(500).json({
                    errorMessage: `Database error: ${e}`,
                  }));
              }
            });
          }
        }).catch(e => res.status(500).json({
          errorMessage: `Database error: ${e}`,
        }));
      }
    });

  /**
   * @api {get} /area/:uuid Get AREA by UUID
   * @apiName GetAREAByUUID
   * @apiGroup AREAS
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiParam {String} uuid AREA UUID.
   *
   * @apiSuccess (Success 200) {Object} area AREA informations.
   * @apiSuccess (Success 200) {String} uuid AREA UUID.
   * @apiSuccess (Success 200) {String} userUUID User UUID.
   * @apiSuccess (Success 200) {String} actionUUID Action UUID.
   * @apiSuccess (Success 200) {String} reactionUUID Reaction UUID.
   * @apiSuccess (Success 200) {Object} actionConfig Action config.
   * @apiSuccess (Success 200) {Object} reactionConfig Reaction config.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/area/:id')
    .all(middleware)
    .get((req, res) => {
      AREA.findByPk(req.params.id).then((area) => {
        if (area) {
          if (area.userUUID === req.decoded.uuid) {
            res.staatus(200).json(area);
          } else {
            res.status(403).json({
              errorMessage: 'Forbidden',
            });
          }
        } else {
          res.status(404).json({
            errorMessage: 'AREA Not Found',
          });
        }
      }).catch(e => res.status(500).json({
        errorMessage: `Database error: ${e}`,
      }));
    });

  /**
   * @api {put} /area/:uuid Update AREA by UUID
   * @apiName PutAREAByUUID
   * @apiGroup AREAS
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiParam {String} uuid AREA UUID.
   * @apiParam {String} actionUUID Action UUID.
   * @apiParam {String} reactionUUID Reaction UUID.
   * @apiParam {Object} actionConfig Action config.
   * @apiParam {Object} reactionConfig Reaction config.
   *
   * @apiSuccess (Success 200) {Object} area AREA informations.
   * @apiSuccess (Success 200) {String} uuid AREA UUID.
   * @apiSuccess (Success 200) {String} userUUID User UUID.
   * @apiSuccess (Success 200) {String} actionUUID Action UUID.
   * @apiSuccess (Success 200) {String} reactionUUID Reaction UUID.
   * @apiSuccess (Success 200) {Object} actionConfig Action config.
   * @apiSuccess (Success 200) {Object} reactionConfig Reaction config.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/area/:id')
    .put((req, res) => {
      let actionConfig;
      let reactionConfig;
      if (req.body.actionConfig) {
        actionConfig = JSON.parse(req.body.actionConfig);
      }
      if (req.body.reactionConfig) {
        reactionConfig = JSON.parse(req.body.reactionConfig);
      }
      let body = {
        actionUUID: req.body.actionUUID,
        reactionUUID: req.body.reactionUUID,
        actionConfig,
        reactionConfig,
      };
      body = prune(body);
      AREA.update(body, {
        where: {
          userUUID: req.decoded.uuid,
          uuid: req.params.id
        }
      }).then(() => AREA.findByPk(req.params.id)
        .then(area => res.status(200).json(area))
        .catch(e => res.status(500).json({
          errorMessage: `Database error: ${e}`,
        })))
        .catch(e => res.status(500).json({
          errorMessage: `Database error: ${e}`,
        }));
    });

  /**
   * @api {delete} /area/:uuid Delete AREA by UUID
   * @apiName DeleteAREAByUUID
   * @apiGroup AREAS
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiParam {String} uuid AREA UUID.
   *
   * @apiSuccess (Success 200) {NULL} NULL NULL
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/area/:id')
    .delete((req, res) => {
      AREA.findByPk(req.params.id).then((area) => {
        if (area) {
          if (area.userUUID === req.decoded.uuid) {
            area.destroy()
              .then(() => res.status(200).json())
              .catch(e => res.status(500).json({
                errorMessage: `Database error: ${e}`,
              }));
          } else {
            res.status(401).json({
              errorMessage: 'Unauthorized',
            });
          }
        } else {
          res.status(404).json({
            errorMessage: 'AREA Not Found',
          });
        }
      });
    });
};
