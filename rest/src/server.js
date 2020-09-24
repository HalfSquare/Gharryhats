var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
var itemManager = require('./item');
const mongoose = require("mongoose");
var HATS_COLLECTION = 'hats';
const Auth = require('./auth/auth');

var jwt = require("jsonwebtoken");
const config = require("../src/config/auth.config");

var app = express();
app.use(bodyParser.json());

var db;

const { User } = require('./models/user');

// For accessing the live database locally
process.env.MONGODB_URI = "mongodb+srv://herokuRestNode:KnND571lRn10cZDk@nwen304-shop-db.f9hmb.mongodb.net/store?retryWrites=true&w=1";

// Connect to the database
let client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true, authMechanism: 'SCRAM-SHA-1' });
client.connect(err => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Get the database callback
  db = client.db();

  // Init the server
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("running on port", port);
  })
})

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true, authMechanism: 'SCRAM-SHA-1' })
  .then(() => console.log('Now connected to MongoDB!'))
  .catch(err => console.error('Something went wrong', err));


// *** API ROUTES *** \\

// Error handler for all endpoints
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

/*  "/api/hats"
 *    GET: finds all hats
 *    POST: creates a new hat
 */

const HATS_URL = "/api/hats";

// GET
app.get(HATS_URL, function (req, res) {
  console.log("Recived GET request");

  db.collection(HATS_COLLECTION).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get hats.");
    } else {
      res.status(200).json(docs);
    }
  });
});


// POST
app.post(HATS_URL, function (req, res) {
  console.log("Recived POST request");

  let email = req.headers.email;
  let pass = req.headers.password;
  let token = req.headers.token;

  // Authenticate user
  Auth.isValidUser(email, pass, token)
    .then(isValid => {
      if (isValid) {
        // Generate the hat to add to the database
        let newHat = req.body;
        newHat.createDate = new Date();


        // Check if the hat is valid
        let missingKeys = itemManager.validateItem(newHat);


        if (missingKeys.length > 0) {
          handleError(res, "Invalid user input", "Must provide the following: " + missingKeys.toString().replace(/,/g, ', '), 400);
        } else {
          // Insert the hat into the collection
          db.collection(HATS_COLLECTION).insertOne(newHat, function (err, doc) {
            if (err) {
              handleError(res, err.message, "Failed to create new hat.");
            } else {
              res.status(201).json(doc.ops[0]);
            }
          });
        }
      } else {
        res.status(401).json({ "error": "Invalid user credentials" });
      }
    })
    .catch(err => handleError(res, err, "Error in validation"))
});


/*  "/api/hats/:id"
 *    GET: get hat by id
 *    PUT: update hat by id
 *    DELETE: delete hat by id
 */
const HAT_BY_ID_URL = "/api/hats/:id";

// GET
app.get(HAT_BY_ID_URL, function (req, res) {
  console.log("Recived GET:id request");

  var id = req.params.id;

  // Find the hat with the matching id
  db.collection(HATS_COLLECTION).findOne({ _id: new ObjectID(id) }, function (err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get hat");
    } else {
      res.status(200).json(doc);
    }
  });
});

// PUT
app.put(HAT_BY_ID_URL, function (req, res) {
  console.log("Recived POST request");

  let email = req.headers.email;
  let pass = req.headers.password;
  let token = req.headers.token;

  // Authenticate user
  Auth.isValidUser(email, pass, token)
    .then(isValid => {
      if (isValid) {
        // Change body to use update expression
        var updateDoc = { $set: req.body };
        delete updateDoc.$set._id;

        var id = req.params.id;

        // Update the hat
        db.collection(HATS_COLLECTION).updateOne({ _id: new ObjectID(id) }, updateDoc, function (err, doc) {
          if (err) {
            handleError(res, err.message, "Failed to update hat");
          } else {
            updateDoc.$set._id = id;
            res.status(200).json(updateDoc.$set);
          }
        });
      } else {
        res.status(401).json({ "error": "Invalid user credentials" });
      }
    })
    .catch(err => handleError(res, err, "Error in validation"))
});


// DELETE
app.delete(HAT_BY_ID_URL, function (req, res) {
  console.log("Recived DELETE request");

  let email = req.headers.email;
  let pass = req.headers.password;
  let token = req.headers.token;

  // Authenticate user
  Auth.isValidUser(email, pass, token)
    .then(isValid => {
      if (isValid) {
        var id = req.params.id;

        // Delete the hat with the given id
        db.collection(HATS_COLLECTION).deleteOne({ _id: new ObjectID(id) }, function (err, result) {
          if (err) {
            handleError(res, err.message, "Failed to delete hat");
          } else {
            res.status(200).json(id);
          }
        });
      } else {
        res.status(401).json({ "error": "Invalid user credentials" });
      }
    })
    .catch(err => handleError(res, err, "Error in validation"))
});

/*  "/api/auth/"
 *    TODO
 *    TODO
 *    TODO
 */

// SIGNUP
app.post('/api/auth/signup', async (req, res) => {
  console.log("SIGN UP")

  let email = req.body.email;
  let name = req.body.name;
  let password = req.body.password;

  let user = await User.findOne({ email: email });

  if (user) {
    res.status(400).send('Email address is already linked with an account');
  } else {
    user = new User({
      name: name,
      email: email,
      password: password
    });
    user.save().then((err, user) => {
      if (err) {
        handleError(res, err.message, "Sign up error");
      } else {
        res.status(201).send(user);
      }
    });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  var email = req.body.email;
  var pass = req.body.password;

  await User.findOne({ email: email, password: pass }, function (err, user) {
    if (err) {
      handleError(res, err.message, "Error in finding user");
    }
    if (!user) {
      res.status(401).send('Credentials do not match');
    }
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      accessToken: token
    });
  });
});

// LOGOUT
app.post('/api/auth/logout', function (req, res) {
});