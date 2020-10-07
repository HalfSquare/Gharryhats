const mongoose = require('mongoose');
 
const Hat = mongoose.model('Hat', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    animal: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    design: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true
    },
    createDate: {
        type: String,
        required: true
    },
}));
 
exports.Hat = Hat;