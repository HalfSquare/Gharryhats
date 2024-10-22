var express = require("express");
var bodyParser = require("body-parser");
// const Promise = require("promise");

var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
// var itemManager = require('./item');
var HATS_COLLECTION = 'hats';
var CARTS_COLLECTION = 'carts';
var USERS_COLLECTION = 'users';

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

exports.getCart = function(id) {
    let getCart = new Promise((resolve, reject) => {
        db.collection(CARTS_COLLECTION).find({userId: id}).toArray(function (err, docs) {
            if (err) {
                reject(docs);
            } else {
                console.log(docs);
                resolve(docs);
            }
        });
    }) 
    return getCart;
}

exports.getItem = function(id) {
    console.log(id);
    let getHat = new Promise((resolve, reject) => {
        db.collection(HATS_COLLECTION).find({_id:ObjectID(id)}).toArray(function (err, docs) {
            if (err) {
                reject(docs);
            } else {
                //console.log(docs);
                resolve(docs);
            }
        });
    }) 
    return getHat;
}

// exports.getNameFromEmail = function(email) {
//     console.log("email", email);
//     let getName = new Promise((res, rej) => {
//         db.collection(USERS_COLLECTION).find({'email': email}).toArray(function (err, docs) {
//             if (err) {
//                 rej(docs);
//             } else {
//                 console.log(docs);
//                 res(docs);
//             }
//         });
//     });
//     return getName;
// }

exports.getUser = function() {
    //TO-DO
    console.log("Getting user");
    return 'undefined';
}

exports.getRelated = function(animal) {
    console.log("ANIMAL: ", animal)
    let getRelated = new Promise((resolve, reject) => {
        db.collection(HATS_COLLECTION).find({"animal":animal}).toArray(function (err, docs) {
            if (err) {
                reject(docs);
            } else {
                console.log("GET RELATED", docs);
                resolve(docs);
            }
        });
    }) 
    return getRelated;
}