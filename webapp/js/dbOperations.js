var express = require("express");
var bodyParser = require("body-parser");
// const Promise = require("promise");

var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
var itemManager = require('./item');
var HATS_COLLECTION = 'hats';

var app = express();
app.use(bodyParser.json());

var db;

const REST_DATABASE = "limitless-cove-65021.herokuapp.com";

// For accessing the live database locally
process.env.MONGODB_URI = "mongodb+srv://herokuRestNode:KnND571lRn10cZDk@nwen304-shop-db.f9hmb.mongodb.net/store?retryWrites=true&w=1";

exports.connect = function(){
    // Connect to the database
    let client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true, authMechanism: 'SCRAM-SHA-1' });
    client.connect(err => {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        // Get the database callback
        db = client.db();
    });
}



exports.getAll = function() {
    let getHats = new Promise((resolve, reject) => {
        db.collection(HATS_COLLECTION).find({}).toArray(function (err, docs) {
            if (err) {
                reject(docs);
            } else {
                resolve(docs);
            }
        });
    }) 
    return getHats;
}

