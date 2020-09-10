var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nwen304-shop-db.f9hmb.mongodb.net/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("nwen304-shop-db");
    dbo.username = "stronggeor@myvuw.ac.nz";
    var query = { animal : "cat" };
    dbo.collection("customers").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});