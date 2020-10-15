const mongoose = require('mongoose');
 
const Cart = mongoose.model('Cart', new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    items: {
        type: [String]
    }
}));
 
exports.Cart = Cart;