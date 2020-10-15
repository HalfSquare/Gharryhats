const express = require('express');
const dbOp = require('../dbOperations');

const getFile = require('../pageGetters/getFile');
const getShop = require('../pageGetters/getShop');
const getItem = require('../pageGetters/getItem');
const getImg = require('../pageGetters/getImg');
const getError = require('../pageGetters/getError');
const getCart = require('../pageGetters/getCart');
const getLogin = require('../pageGetters/getLogin');

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

// Get cart
router.get('/cart', (req, res) => {
    let id = "" //TODO get id from cookie
    dbOp.getCart(id).then(cart => {
        console.log(cart.items);
        getCart(req, res, './cart.html', cart); 
    })
});

// Login redirect
router.get('/login', (req, res) => {
    res.redirect('/auth/login');
})

const GOOGLE_OAUTH_CALLBACK = "/google/callback";

router.use(GOOGLE_OAUTH_CALLBACK, (req, res) => {
    getLogin(req, res, './login/googleAuthLoginPage.html', './login/js/googleAuthLoginController.js');
});

// Default
router.use('/', (req, res, next) => {
    // console.log(req.params);
    getFile(req, res, './main/index.html');
});

module.exports = router;