var mongoose = require('mongoose');
var uuid = require('node-uuid');

var ClientModel = function() {
  var clientSchema = mongoose.Schema({
    clientId:     { type: String, default: uuid.v4(), unique: true },
    clientSecret: { type: String, default: uuid.v4(), unique: true },
    createdAt:    { type: Date,   default: Date.now },
    name:         { type: String, unique: true },
    scope:        { type: String },
    userId:       { type: String },
    redirectUri:  { type: String }
  });

  return mongoose.model('Client', clientSchema);
};

module.exports = new ClientModel();