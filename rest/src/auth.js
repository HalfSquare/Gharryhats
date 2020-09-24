const { User } = require('../src/user');

const tokenValidate = (resolve, reject) => {
  reject("Token validation not implimented yet");
}

const emailValidate = (resolve, reject) => {
  User.findOne({ email: email, password: pass }, function (err, user) {
    if (err) {
      reject('Login error');
    } else if (!user) {
      resolve(false);
    }
    resolve(true);
  });
}

const invalidCredentials = (resolve, reject) => {
  reject("Invalid credentials");
}

const isValidUser = function (email, pass, token) {
  if (token) {
    return new Promise(tokenValidate);
  } else if (email && password) {
    return new Promise(emailValidate);
  } else {
    return new Promise(invalidCredentials);
  }
}

exports.isValidUser = isValidUser;