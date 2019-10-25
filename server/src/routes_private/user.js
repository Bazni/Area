import { prune } from '../utils/utils';

const { User } = global.app.get('models');

module.exports = (router, middleware) => {
  /**
   * @api {get} /me Get current user data
   * @apiName GetMe
   * @apiGroup Users
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiSuccess (Success 200) {Object} users User informations.
   * @apiSuccess (Success 200) {String} users.uuid User UUID.
   * @apiSuccess (Success 200) {String} users.role User role.
   * @apiSuccess (Success 200) {String} users.firstName User first name.
   * @apiSuccess (Success 200) {String} users.lastName User last name.
   * @apiSuccess (Success 200) {String} users.email User email.
   * @apiSuccess (Success 200) {String} users.phone User phone number.
   * @apiSuccess (Success 200) {String} users.photoUrl User photo URL.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/me')
    .all(middleware)
    .get((req, res) => User.scope('noPass').findByPk(req.decoded.uuid)
      .then(user => res.status(200).json(user))
      .catch(e => res.status(500).json({
        errorMessage: `Database error: ${e}`,
      })));

  /**
   * @api {get} /users Get users list
   * @apiName GetUsers
   * @apiGroup Users
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiSuccess (Success 200) {Object[]} users User informations.
   * @apiSuccess (Success 200) {String} users.uuid User UUID.
   * @apiSuccess (Success 200) {String} users.role User role.
   * @apiSuccess (Success 200) {String} users.firstName User first name.
   * @apiSuccess (Success 200) {String} users.lastName User last name.
   * @apiSuccess (Success 200) {String} users.email User email.
   * @apiSuccess (Success 200) {String} users.phone User phone number.
   * @apiSuccess (Success 200) {String} users.photoUrl User photo URL.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/users')
    .all(middleware)
    .get((req, res) => {
      if (req.decoded.role !== 42) {
        return res.status(401).json({
          errorMessage: 'Unauthorized',
        });
      }
      return User.scope('noPass').findAll()
        .then(users => res.status(200).json(users))
        .catch(e => res.status(500).json({
          errorMessage: `Database error: ${e}`,
        }));
    });

  /**
   * @api {get} /user/:uuid Get user
   * @apiName GetUserByUUID
   * @apiGroup Users
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiParam {String} uuid User UUID.
   *
   * @apiSuccess (Success 200) {Object} user User informations.
   * @apiSuccess (Success 200) {String} user.uuid User UUID.
   * @apiSuccess (Success 200) {String} user.role User role.
   * @apiSuccess (Success 200) {String} user.firstName User first name.
   * @apiSuccess (Success 200) {String} user.lastName User last name.
   * @apiSuccess (Success 200) {String} user.email User email.
   * @apiSuccess (Success 200) {String} user.phone User phone number.
   * @apiSuccess (Success 200) {String} user.photoUrl User photo URL.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/user/:id')
    .all(middleware)
    .get((req, res) => {
      User.scope('noPass').findByPk(req.params.id)
        .then(user => res.status(200).json(user))
        .catch(e => res.status(500).json({
          errorMessage: `Database error: ${e}`,
        }));
    });

  /**
   * @api {put} /user/:uuid Update user
   * @apiName PutUser
   * @apiGroup Users
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiParam {String} uuid User UUID.
   * @apiParam {Number} role User role.
   * @apiParam {String} firstName User first name.
   * @apiParam {String} lastName User last name.
   * @apiParam {String} email User email.
   * @apiParam {String} phone User phone number.
   *
   * @apiSuccess (Success 200) {Object} user User informations.
   * @apiSuccess (Success 200) {String} user.uuid User UUID.
   * @apiSuccess (Success 200) {String} user.role User role.
   * @apiSuccess (Success 200) {String} user.firstName User first name.
   * @apiSuccess (Success 200) {String} user.lastName User last name.
   * @apiSuccess (Success 200) {String} user.email User email.
   * @apiSuccess (Success 200) {String} user.phone User phone number.
   * @apiSuccess (Success 200) {String} user.photoUrl User photo URL.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/user/:id')
    .all(middleware)
    .put((req, res) => {
      let body = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        // password: req.body.password,
        // passwordConfirm: req.body.passwordConfirm,
      };
      if (req.decoded.role === 42) {
        body.role = req.body.role;
      }
      body = prune(body);
      User.update(body, {
        where: {
          uuid: req.params.id,
        },
      }).then(() => User.scope('noPass').findByPk(req.params.id)
        .then(user => res.status(200).json(user))
        .catch(e => res.status(500).json({
          errorMessage: `Database error: ${e}`,
        })))
        .catch(e => res.status(500).json({
          errorMessage: `Database error: ${e}`,
        }));
    });

  /**
   * @api {delete} /user/:uuid Delete user
   * @apiName DeleteUser
   * @apiGroup Users
   *
   * @apiHeader {String} authorization User token.
   *
   * @apiParam {String} uuid User UUID.
   *
   * @apiSuccess (Success 200) {NULL} NULL NULL
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/user/:id')
    .all(middleware)
    .delete((req, res) => {
      if (req.decoded.role !== 42) {
        res.status(401).json({
          errorMessage: 'Unauthorized',
        });
      } else {
        User.destroy({
          where: {
            uuid: req.params.id,
          },
        }).then(() => res.status(200).json())
          .catch(e => res.status(500).json({
            errorMessage: `Database error: ${e}`,
          }));
      }
    });
};
