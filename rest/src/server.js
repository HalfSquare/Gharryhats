var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
var itemManager = require('./item');
var HATS_COLLECTION = 'hats';

var app = express();
app.use(bodyParser.json());

var db;

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


  // Generate the hat to add to the database
  var newHat = req.body;
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
});


/*  "/api/hats/:id"
 *    GET: get hat by id
 *    PUT: update hat by id
 *    DELETE: delete hat by id
 */
const HAT_BY_ID_URL = "/api/hats/:id";

 // GET
app.get(HAT_BY_ID_URL, function (req, res) {
  
  console.log("id");
  var id = req.params.id;

  // Find the hat with the matching id
  db.collection(HATS_COLLECTION).findOne({ _id: new ObjectID(id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get hat");
    } else {
      res.status(200).json(doc);
    }
  });
});

// PUT
app.put(HAT_BY_ID_URL, function (req, res) {
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
});


// DELETE
app.delete(HAT_BY_ID_URL, function (req, res) {
  console.log("Recived DELETE request");

  var id = req.params.id;

  // Delete the hat with the given id
  db.collection(HATS_COLLECTION).deleteOne({ _id: new ObjectID(id) }, function (err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete hat");
    } else {
      res.status(200).json(id);
    }
  });
});