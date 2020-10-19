const { User } = require('../models/user');
const Client = require('../models/client');
const AuthCode = require('../models/oAuth/authCode');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { Error } = require('../error/CustomMongoError');
const Token = require('../models/oAuth/token');
const { ObjectId } = require('mongodb');

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
      jwt.verify(token, config.access_secret, (err, decoded) => {
        if (err) {
          reject(new Error("ValidationError"));
        }
        else {
          Token.findOne({
            accessToken: token
          }, function(err, accessToken) {
            if (err || !accessToken) {
              reject(new Error("ValidationError"));
              return;
            }
            var seconds = new Date().getTime() / 1000;
            if (decoded.exp >= seconds) {
              reject(new Error("ValidationError"));
              return;
            }
            else {
              resolve();
            }
          });
        }
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
  if (!req.session || !req.session.user) {
    // User is not logged in
    // TODO direct to login page
    console.log("user not logged in");
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
        (state === undefined ? '' : '&state=' + state)
        + '&userid=' + req.session.user.id;
      res.redirect(redirect);
    } else {
      res.json(response);
    }
  });
}

async function oauth_token(req, res) {
  var grantType = req.body.grant_type;
  var authCode = req.body.code;
  var redirectUri = req.body.redirect_uri; // TODO maybe?
  var clientId = req.body.client_id;
  var userId = req.body.user_id;

  if (grantType === 'authorization_code') {
    AuthCode.findOne({
      code: authCode
    }, async function(err, code) {
      if (code) {
        if (code.consumed) {
          //TODO Cancel code has already been used
        }
        code.consumed = true;
        code.save();

        Client.findOne({
          clientId: clientId
        }, async function(error, client) {

          if (!client) {
            // TODO
          }

          var refreshToken = jwt.sign({"userid":userId}, config.refresh_secret, { expiresIn: 86400 });
          var accessToken = jwt.sign({"userid":userId}, config.access_secret, { expiresIn: 3600 });

          req.session.accessToken = accessToken;

          var token = new Token({
            refreshToken: refreshToken,
            accessToken: accessToken,
            userId: code.userId
          });
          await token.save();

          let user = await User.find({_id: ObjectId(code.userId)});
          var response = {
            access_token: token.accessToken,
            refresh_token: token.refreshToken,
            expires_in: token.expiresIn,
            token_type: token.tokenType,
            name: user[0].name
          };
          
          res.json(response);
        });
      }
    });
  }
}

// Refresh token
async function refresh_token(req, res) {
  let refresh = req.headers.refresh_token

  jwt.verify(refresh, config.refresh_secret, async (err, decoded) => {
    if(err || !decoded) {
      res.sendStatus(401).send("Validation Error");
    }
    else {
      console.log("OK")
      Token.findOne({
        refreshToken: refresh
      }, async function(err, token) {
        if (err || !token) {
          console.log(token)
          res.sendStatus(401).send("Validation Error");
        }
        else {
          console.log("OK")
          let userId = decoded.userid
          var refreshToken = jwt.sign({"userid":userId}, config.refresh_secret, { expiresIn: 86400 });
          var accessToken = jwt.sign({"userid":userId}, config.access_secret, { expiresIn: 3600 });
        
          var token = new Token({
            refreshToken: refreshToken,
            accessToken: accessToken,
            userId: userId
          });
          await token.save()
          User.find({_id: ObjectId(userId)}).then(user => {
            var response = {
              access_token: token.accessToken,
              refresh_token: token.refreshToken,
              expires_in: token.expiresIn,
              token_type: token.tokenType,
              name: user[0].name
            };
            
            res.json(response);
          })
        }
      })
    }
  })
}

exports.refresh_token = refresh_token;
exports.oauth_token = oauth_token;
exports.oauth_authorise = oauth_authorise;
exports.validateUser = validateUser;
exports.isPasswordComplex = isPasswordComplex;