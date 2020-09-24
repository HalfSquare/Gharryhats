const { User } = require('../models/user');
const jws = require('jsonwebtoken');
const config = require('../config/auth.config');

const invalidCredentials = (resolve, reject) => {
  reject("Invalid credentials");
}

const isValidUser = function (email, pass, token) {
  if (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          resolve(false);
        }
        resolve(true);
      })
    });
  }

  else if (email && pass) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: email, password: pass }, function (err, user) {
        if (err) {
          reject('Login error');
        } else if (!user) {
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  else {
    return new Promise(invalidCredentials);
  }
}

exports.isValidUser = isValidUser;