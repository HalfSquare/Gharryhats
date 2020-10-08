const { User } = require('../models/user');
const Client = require('../models/client');
const AuthCode = require('../models/oAuth/authCode');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { Error } = require('../error/CustomMongoError');

// At least one uppercase, one lowercase and one number with a min length
const passwordMinLength = 8;
const passwordValidRegex = new RegExp('^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{' + passwordMinLength + ',}$');

const isPasswordComplex = pass => passwordValidRegex.test(pass);

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

function oauth_authorise(req, res) {
  var responseType = req.query.response_type;
  var clientId = req.query.client_id;
  var redirectUri = req.query.redirect_uri;
  var scope = req.query.scope;
  var state = req.query.state;
  console.log(req.session)
  if (!req.session || !req.session.user) {
    // User is not logged in
    // TODO direct to login page
    return res.redirect(LOGIN_URL);
  }

  Client.findOne({
    clientId: clientId
  }, function (err, client) {
    if (!client){
      // TODO    
    }
    var authCode = new AuthCode({
      clientId: clientId,
      userId: req.session.user.id,
      redirectUri: redirectUri
    })
    authCode.save()

    var response = {
      state: state,
      code: authCode.code
    };

    if (redirectUri) {
      var redirect = redirectUri +
        '?code=' + response.code +
        (state === undefined ? '' : '&state=' + state);
      res.redirect(redirect);
    } else {
      res.json(response);
    }
  });
}

function oauth_token(req, res) {
  var grantType = req.body.grant_type;
  var authCode = req.body.code;
  var redirectUri = req.body.redirect_uri; // TODO maybe?
  var clientId = req.body.client_id;

  if (grantType === 'authorization_code') {
    AuthCode.findOne({
      code: authCode
    }, function(err, code) {
      if (code) {
        code.consumed = true;
        code.save();

        Client.findOne({
          clientId: clientId
        }, function(error, client) {

          if (!client) {
            // TODO
          }

          var refreshToken = jwt.sign({ id: req.session.user }, config.refresh_secret, { expiresIn: 86400 });
          var accessToken = jwt.sign({ id: req.session.user }, config.access_secret, { expiresIn: 3600 });

          req.session.accessToken = accessToken;

          var token = new Token({
            refreshToken: refreshToken,
            accessToken: accessToken,
            userId: code.userId
          });
          token.save();

          var response = {
            access_token: token.accessToken,
            refresh_token: token.refreshToken,
            expires_in: token.expiresIn,
            token_type: token.tokenType
          };
          
          res.json(response);
        });
      }
    });
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

exports.oauth_token = oauth_token;
exports.oauth_authorise = oauth_authorise;
exports.authorize = authorize;
exports.validateUser = validateUser;
exports.isPasswordComplex = isPasswordComplex;