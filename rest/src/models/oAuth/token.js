var mongoose = require('mongoose');

var TokenModel = function() {
  var tokenSchema = mongoose.Schema({
    userId:       { type: String },
    refreshToken: { type: String },
    accessToken:  { type: String },
    expiresIn:    { type: String, default: '3600' },
    tokenType:    { type: String, default: 'bearer' },
    consumed:     { type: Boolean, default: false },
    createdAt:    { type: Date, default: Date.now }
  });

  return mongoose.model('Token', tokenSchema);
};

module.exports = new TokenModel();