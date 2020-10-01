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

//TODO: remove
const HATS_COLLECTION = 'hats';

const HATS_URL = "/api/hats";
const HAT_BY_ID_URL = "/api/hats/:id";
const LOGIN_URL = "/api/auth/login";
const SIGNUP_URL = "/api/auth/signup";
const LOGOUT_URL = "/api/auth/logout";

const app = express();
app.use(bodyParser.json());

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
        return jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
      }
      throw Error("EmailNotFound");
    })
    .then(token => {
      //TODO: save the token
      return token;
    })
    .then(token => res.status(200).send({ "token": token }))
    .catch(err => handleMongooseError(res, err));
});

// LOGOUT
app.post(LOGOUT_URL, function (req, res) {
});