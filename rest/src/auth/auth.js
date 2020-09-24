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

exports.validateUser = validateUser;