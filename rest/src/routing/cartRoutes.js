const { Hat } = require("../models/hat");
const { Cart } = require("../models/cart");
const { handleError, handleMongooseError } = require("../error/errorHandler");
const { Error } = require('../error/CustomMongoError');
const Auth = require("../auth/auth");
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const express = require('express');
let router = express.Router();

router.post('/', async function (req, res) {
    Auth.validateUser(req.headers).then(() => {
        jwt.verify(req.headers.token, config.access_secret, async (err, decoded) => {
            if (!err) {
                console.log(req.headers);
                let hatId = req.headers.hatid;
                if (!hatId) {
                    throw new Error("HatNotFound");
                }

                let userid = decoded.userid
                let cart = await Cart.find({ userId: userid })
                if (cart.length == 0) {
                    throw Error("NoCartFoundForUser");
                }
                cart = cart[0];

                console.log(cart);
                if (!cart.items) cart.items = [];
                cart.items.push(hatId);
                cart.save();

                res.writeHead(201, { 'Content-Type': 'text/plain' });
                res.write("done");
                res.end();

            }
            else {
                console.log("CART FAIL at post / cart", err)
            }
        })

    }).catch(err => handleMongooseError(res, err));
});

router.delete('/', function (req, res) {
    res.send('delete');
})

router.get('/', function (req, res) {
    Auth.validateUser(req.headers).then(() => {
        jwt.verify(req.headers.token, config.access_secret, (err, decoded) => {
            if (!err) {
                let userid = decoded.userid
                Cart.find({ userId: userid }).then((cart) => {
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    console.log('CART:', cart);
                    res.write(JSON.stringify(cart[0] ? cart[0].items ?? [] : []));
                    res.end();
                }).catch(err => console.log('no', err));
            }
            else {
                console.log("CART FAIL at get / cart", err)
            }
        })

    }).catch(err => handleMongooseError(res, err));
});

module.exports = router;