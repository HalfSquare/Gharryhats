const mongoose = require('mongoose');
 
const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleID: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return this.googleID == null
        }
    }
}));
 
exports.User = User;