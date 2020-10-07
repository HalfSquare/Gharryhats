const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { Error } = require('../error/CustomMongoError');

const invalidCredentials = (resolve, reject) => {
  reject(Error("CredentialsNotGiven"));
}

const validateUser = function (email, pass, token) {
  if (typeof email === 'object' && email != null) {
    pass = email.password;
    token = email.token;
    email = email.email;
  } 

  // Token validation
  if (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject(Error("ValidationError"));
        }
        //TODO check if token is in db
        resolve();
      })
    });
  }

  // Password validation
  else if (email && pass) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: email, password: pass })
        .then(user => user ? resolve() : reject(Error("UserNotFound")))
        .catch(err => reject(err));
    });
  }

  else {
    return new Promise(invalidCredentials);
  }
}

var Token = require('../models/oAuth/token');

var authorize = function(req, res, next) {
  var accessToken;

  if (req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');

    if (parts.length < 2) {
      res.set('WWW-Authenticate', 'Bearer');
      res.sendStatus('401');
      return;
    }
    accessToken = parts[1];
  } else {
    accessToken = req.query.access_token || req.body.access_token;
  }

  Token.findOne({
    accessToken: accessToken
  }, function(err, token) {
    Token.update({
      userId: token.userId,
      consumed: false
    }, {
      $set: { consumed: true }
    });
  });
};

exports.authorize = authorize;
exports.validateUser = validateUser;
