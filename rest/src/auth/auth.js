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

const validateUser = function (obj, pass, token) {
  let email;
  if (typeof obj === 'object' && obj != null) {
    pass = obj.password;
    token = obj.token;
    email = obj.email;
  } else {
    email = obj;
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
            if (decoded.exp <= seconds) {
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
  let userid = req.query.userid;

  Client.findOne({
    clientId: clientId
  }, function (err, client) {
    if (!client){
      throw Error("NoClient");
    }
    var authCode = new AuthCode({
      clientId: clientId,
      userId: userid,
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
        + '&userid=' + userid;
      res.redirect(redirect);
    } else {
      res.json(response);
    }
  });
}

async function oauth_token(req, res) {
  var grantType = req.body.grant_type;
  var authCode = req.body.code;
  var redirectUri = req.body.redirect_uri;
  var clientId = req.body.client_id;
  var userId = req.body.user_id;

  if (grantType === 'authorization_code') {
    AuthCode.findOne({
      code: authCode
    }, async function(err, code) {
      if (code) {
        code.consumed = true;
        code.save();

        Client.findOne({
          clientId: clientId
        }, async function(error, client) {

          if (!client) {
            throw Error("NoClient");
          }

          var refreshToken = jwt.sign({"userid":userId}, config.refresh_secret, { expiresIn: 86400 });
          var accessToken = jwt.sign({"userid":userId}, config.access_secret, { expiresIn: 3600 });

          var token = new Token({
            refreshToken: refreshToken,
            accessToken: accessToken,
            userId: userId
          });
          await token.save();

          let user = await User.find({_id: ObjectId(userId)});
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
      Token.findOne({
        refreshToken: refresh
      }, async function(err, result) {
        if (err || !result) {
          res.sendStatus(401).send("Validation Error");
        }
        else {
          let userId = decoded.userid
          var accessToken = jwt.sign({"userid":userId}, config.access_secret, { expiresIn: 3600 });
        
          result.accessToken = accessToken;
          await result.save()
          User.find({_id: ObjectId(userId)}).then(user => {
            var response = {
              access_token: result.accessToken,
              expires_in: result.expiresIn,
              token_type: result.tokenType,
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