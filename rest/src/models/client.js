var mongoose = require('mongoose');
var uuid = require('node-uuid');

var ClientModel = function() {
  var clientSchema = mongoose.Schema({
    clientId: { 
      type: String, default: uuid.v4(), 
      required: true,
      unique: true 
    },
    clientSecret: { 
      type: String,
      required: true
    },
    name: { 
      type: String, 
      required: true,
      unique: true 
    },
    scope: { 
      type: String
    }
  });

  return mongoose.model('Client', clientSchema);
};

module.exports = new ClientModel();