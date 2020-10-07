const express = require("express");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const Auth = require('./auth/auth');
const itemManager = require('./item');
const config = require("./config/auth.config");
const { User } = require('./models/user');
const { Hat } = require("./models/hat");
const { handleError, handleMongooseError } = require('./error/errorHandler');
const { Error } = require('./error/CustomMongoError');
const bcrypt = require('bcrypt');

const AuthCode = require('./models/oAuth/authCode');
const Client = require('./models/client');
const Token = require('./models/oAuth/token');

var cookieParser = require('cookie-parser');
var session = require('express-session');

//TODO: remove
const HATS_COLLECTION = 'hats';

const HATS_URL = "/api/hats";
const HAT_BY_ID_URL = "/api/hats/:id";
const LOGIN_URL = "/api/auth/login";
const SIGNUP_URL = "/api/auth/signup";
const LOGOUT_URL = "/api/auth/logout";

const app = express();
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'sessGhatsSecret',
  resave: false,
  saveUninitialized: false
}));

// For accessing the live database locally
process.env.MONGODB_URI = "mongodb+srv://herokuRestNode:KnND571lRn10cZDk@nwen304-shop-db.f9hmb.mongodb.net/store?retryWrites=true&w=1";
process.env.PORT = 8080;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true, authMechanism: 'SCRAM-SHA-1' })
  .then(() => app.listen(process.env.PORT || 8080))
  .then(server => console.log("Running on port ", server.address().port))
  // .then(connection => console.log('Now connected to MongoDB!\nUsing models:', connection.modelNames()))
  .catch(err => console.error('Something went wrong', err));


// *** API ROUTES *** \\

/*  "/api/hats"
 *    GET: finds all hats
 *    POST: creates a new hat
 */


// GET
app.get(HATS_URL, function (req, res) {
  console.log("Recived GET request");

  Hat.find({})
    .then((hats) => res.status(200).json(hats))
    .catch(err => handleError(res, err, "Error in finding hats"));

});


// POST
app.post(HATS_URL, function (req, res) {
  console.log("Recived POST request");

  // Authenticate user
  Auth.validateUser(req.headers)
    .then(() => {
      req.body.createDate = new Date();
      return Hat(req.body).save();
    })
    .then(hat => res.status(201).send(hat))
    .catch(err => handleMongooseError(res, err))
});


/*  "/api/hats/:id"
 *    GET: get hat by id
 *    PUT: update hat by id
 *    DELETE: delete hat by id
 */

// GET
app.get(HAT_BY_ID_URL, function (req, res) {
  console.log("Recived GET:id request");

  var id = req.params.id;

  Hat.findById(id)
    .then(user => res.status(user ? 200 : 404).json(user || {}))
    .catch(err => handleMongooseError(res, err))
});

// PUT
app.put(HAT_BY_ID_URL, function (req, res) {
  console.log("Recived POST request");

  let updateQuery = { _id: req.params.id }

  // Authenticate user
  Auth.validateUser(req.headers)
    .then(() => Hat.updateOne(updateQuery, req.body))
    .then(() => Hat.findById(req.params.id))
    .then(update => res.status(200).send(update))
    .catch(err => handleMongooseError(res, err))

});


// DELETE
app.delete(HAT_BY_ID_URL, function (req, res) {
  console.log("Recived DELETE request");

  // Authenticate user
  Auth.validateUser(req.headers)
    .then(() => Hat.findById(req.params.id))
    .then(user => {
      if (!user) {
        throw Error("HatNotFound")
      }
      return user.remove()
    })
    .then(deleted => res.status(200).send(deleted))
    .catch(err => handleMongooseError(res, err))
});

/*  "/api/auth/"
 *    TODO
 *    TODO
 *    TODO
 */

// SIGNUP
app.post(SIGNUP_URL, async (req, res) => {
  console.log("SIGN UP")

  let password = req.body.password;
  let BCRYPT_SALT_ROUNDS = 12;

  //Check password complexity
  if (Auth.isPasswordComplex(password)) {
    bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
    .then(hashedPassword => {
      req.body.password = hashedPassword;
      // Making a new user ignores random junk in body
      new User(req.body).save()
      .then(user => res.status(201).send(user))
    })
    .catch(err => handleMongooseError(res, err));
  } else {
    handleMongooseError(res, Error("PasswordNotComplex"))
  }

  // Encrypt the password
  

});

// LOGIN
app.post(LOGIN_URL, (req, res) => {
  console.log("login request recived");
  var email = req.body.email;
  var pass = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        var passIsValid = bcrypt.compareSync(pass, user.password);
        if (!passIsValid) {
          throw Error("InvalidPassword")
        }
        req.session.user = user
        return res.redirect("/oauth/authorise");
      }
      throw Error("EmailNotFound");
    })
    .catch(err => handleMongooseError(res, err));
});

// LOGOUT
app.post(LOGOUT_URL, function (req, res) {
});

app.get('/oauth/authorise', function(req, res) {
  var responseType = req.query.response_type;
  var clientId = req.query.client_id;
  var redirectUri = req.query.redirect_uri;
  var scope = req.query.scope;
  var state = req.query.state;
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
});

app.post('/oauth/token', function (req, res) {
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
});