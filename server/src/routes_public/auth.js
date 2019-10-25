import https from 'https';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import uuidv1 from 'uuid/v1';
import config from '../../config';

const { User } = global.app.get('models');

module.exports = (router) => {
  /**
   * @api {post} /auth/register Register
   * @apiName Register
   * @apiGroup Auth
   *
   * @apiParam {String} email User email
   * @apiParam {String} firstName User first name
   * @apiParam {String} lastName User last name
   * @apiParam {String} password User password
   * @apiParam {String} passwordConfirm User password confirmation
   *
   * @apiSuccess (Success 200) {String} uuid User uuid.
   * @apiSuccess (Success 200) {String} firstName User first name.
   * @apiSuccess (Success 200) {String} lastName User last name.
   * @apiSuccess (Success 200) {String} email User email.
   * @apiSuccess (Success 200) {String} phone User phone.
   * @apiSuccess (Success 200) {String} photoUrl User photo URL.
   * @apiSuccess (Success 200) {String} token User token.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/auth/register')
    .post((req, res) => {
      User.count().then((c) => {
        if (req.body.email
          && req.body.firstName
          && req.body.lastName
          && req.body.password
          && req.body.password === req.body.passwordConfirm) {
          const salt = bcrypt.genSaltSync(10);
          User.create({
            uuid: uuidv1(),
            role: (c === 0) ? 42 : 0,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            phone: req.body.phone,
          }).then((user) => {
            const token = jwt.sign({ uuid: user.uuid, role: user.role }, config.jwt.secret, {
              expiresIn: config.jwt.tokenLife,
            });
            return res.status(200).json({
              uuid: user.uuid,
              role: user.role,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              photoUrl: user.photoUrl,
              token,
            });
          }).catch(e => res.status(500).json({
            errorMessage: `Database error: ${e}`,
          }));
        } else {
          res.status(400).json({
            errorMessage: 'Invalid parameters',
          });
        }
      }).catch((e) => {
        console.log(e);
      });
    });

  /**
   * @api {post} /auth/login Login
   * @apiName Login
   * @apiGroup Auth
   *
   * @apiParam {String} email User email.
   * @apiParam {String} password User password.
   *
   * @apiSuccess (Success 200) {String} uuid User uuid.
   * @apiSuccess (Success 200) {String} firstName User first name.
   * @apiSuccess (Success 200) {String} lastName User last name.
   * @apiSuccess (Success 200) {String} email User email.
   * @apiSuccess (Success 200) {String} phone User phone.
   * @apiSuccess (Success 200) {String} photoUrl User photo URL.
   * @apiSuccess (Success 200) {String} token User token.
   *
   * @apiSuccess (Error 4xx - 5xx) {String} errorMessage Error Description
   */
  router.route('/auth/login')
    .post((req, res) => {
      User.findOne({
        where: {
          email: req.body.email,
        },
      }).then((user) => {
        if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({ uuid: user.uuid, role: user.role }, config.jwt.secret, {
              expiresIn: config.jwt.tokenLife,
            });
            return res.status(200).json({
              uuid: user.uuid,
              role: user.role,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              photoUrl: user.photoUrl,
              token,
            });
          }
          return res.status(400).json({
            errorMessage: 'Invalid password',
          });
        }
        return res.status(400).json({
          errorMessage: 'User not found',
        });
      }).catch(e => res.status(500).json({
        errorMessage: `Database error: ${e}`,
      }));
    });

  /**
   * @api {post} /auth/facebook Facebook Login
   * @apiName Facebook Login
   * @apiGroup Auth
   *
   * @apiParam {String} fbAccessToken Facebook Access Token
   *
   * @apiSuccess (Success 200) {String} uuid User uuid.
   * @apiSuccess (Success 200) {String} firstName User first name.
   * @apiSuccess (Success 200) {String} lastName User last name.
   * @apiSuccess (Success 200) {String} email User email.
   * @apiSuccess (Success 200) {String} phone User phone.
   * @apiSuccess (Success 200) {String} photoUrl User photo URL.
   * @apiSuccess (Success 200) {String} token User token.
   *
   * @apiSuccess (Error 4xx) {String} errorMessage Error Description
   */
  router.route('/auth/facebook')
    .post((req, res) => {
      const options = {
        host: 'graph.facebook.com',
        port: 443,
        path: `/v3.2/me?fields=id%2Cfirst_name%2Clast_name%2Cemail&access_token=${req.body.fbAccessToken}`,
        method: 'GET',
      };

      let buffer = '';
      https.get(options, (result) => {
        result.setEncoding('utf8');
        result.on('data', (chunk) => {
          buffer += chunk;
        }).on('end', () => {
          buffer = JSON.parse(buffer);
          User.count().then((c) => {
            User.count({
              where: {
                email: buffer.email,
              },
            }).then((total) => {
              if (!total) {
                User.create({
                  uuid: uuidv1(),
                  role: (c === 0) ? 42 : 0,
                  firstName: buffer.first_name,
                  lastName: buffer.last_name,
                  email: buffer.email,
                  password: 'fbaccountnopass',
                  facebookAccessToken: req.body.fbAccessToken,
                }).then((user) => {
                  const token = jwt.sign({ uuid: user.uuid, role: user.role }, config.jwt.secret, {
                    expiresIn: config.jwt.tokenLife,
                  });
                  return res.status(200).json({
                    uuid: user.uuid,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    photoUrl: user.photoUrl,
                    token,
                  });
                }).catch(e => res.status(500).json({
                  errorMessage: `Database error: ${e}`,
                }));
              } else {
                User.update({
                  fbAccessToken: req.body.fbAccessToken,
                }, {
                  where: {
                    email: buffer.email,
                  },
                }).then(() => User.scope('noPass')
                  .findOne({
                    where: {
                      email: buffer.email,
                    },
                  })
                  .then(user => res.status(200).json(user))
                  .catch(e => res.status(500).json({
                    errorMessage: `Database error: ${e}`,
                  })))
                  .catch(e => res.status(500).json({
                    errorMessage: `Database error: ${e}`,
                  }));
              }
            }).catch((e) => {
              console.log(e);
            });
          }).catch((e) => {
            console.log(e);
          });
        });
      }).on('error', () => res.status(500).json({
        errorMessage: 'Failed to fetch Facebook data',
      }));
    });
};
