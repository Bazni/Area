import jwt from 'jsonwebtoken';
import config from '../../config';

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  if (token) {
    if (token.substr(0, 7) === 'Bearer ') {
      token = token.substr(7);
    }
    return jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          errorMessage: 'Bad Token',
        });
      }
      req.decoded = decoded;
      return next();
    });
  }
  return res.status(401).send({
    errorMessage: 'No token provided.',
  });
};
