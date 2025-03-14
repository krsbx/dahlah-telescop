const { asyncMw } = require('express-asyncmw');
const _ = require('lodash');
const { verifyJwtToken } = require('../utils/jwt');

exports.authMw = asyncMw(async (req, res, next) => {
  const authorization = _.get(req, 'headers.authorization', '');

  if (!authorization) {
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });
  }

  try {
    const user = await verifyJwtToken(token);

    req.auth = user;

    return next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });
  }
});

exports.optionalAuthMw = asyncMw(async (req, res, next) => {
  const authorization = _.get(req, 'headers.authorization', '');

  if (!authorization) {
    return next();
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized',
    });
  }

  try {
    const user = await verifyJwtToken(token);

    req.auth = user;

    return next();
  } catch (err) {
    return next();
  }
});
