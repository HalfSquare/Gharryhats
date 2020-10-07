const express = require('express');
const dbOp = require('../dbOperations');

const getFile = require('../pageGetters/getFile');
const getShop = require('../pageGetters/getShop');
const getItem = require('../pageGetters/getItem');
const getImg = require('../pageGetters/getImg');
const getError = require('../pageGetters/getError');

// Define the router
let router = express.Router();

// Shop
router.get("/shop", (req, res, next) => {
    dbOp.getAll()
        .then(hats => getShop(req, res, './shop.html', hats))
        .catch(err => getError(req, res, err));
});

// Get Image
router.get('/img/:image', (req, res, next) => {
    getImg(req, res, './img/' + req.params.image);
});

// Get hat
router.get('/hat/:hatid', (req, res, next) => {
    dbOp.getItem(req.params.hatid)
                .then(hat => getItem(req, res, './shop.html', hat))
                .catch(err => getError(req, res, err));
});

// Login redirect
router.get('/login', (req, res) => {
    res.redirect('/auth/login');
})

// Default
router.use('/', (req, res, next) => {
    // console.log(req.params);
    getFile(req, res, './index.html');
});


module.exports = router;