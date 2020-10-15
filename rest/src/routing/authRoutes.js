const Auth = require('../auth/auth');
const { User } = require('../models/user');
const { Cart } = require('../models/cart');
const { handleMongooseError } = require('../error/errorHandler');
const { Error } = require('../error/CustomMongoError');
const bcrypt = require('bcrypt');
var uuid = require('node-uuid');

const LOGIN_URL = "/login";
const SIGNUP_URL = "/signup";
const LOGOUT_URL = "/logout";
const GOOGLE_AUTHORISE = "/google"

const CALLBACK_URL = "/callback";
const OAUTH_AUTHERISE_URL = '/oauth/authorise';
const OAUTH_TOKEN_URL = '/oauth/token';

const OAUTH_CLIENTID = "e47532c3-3c2b-4e38-a534-8b709772e4a0";

const express = require('express');
let router = express.Router();

function create_cart(user) {
    new Cart({userId: user.id, items: []}).save()
}

// SIGNUP
router.post(SIGNUP_URL, async (req, res) => {
    console.log("SIGN UP")

    let body = {};

    body.email = req.body.email || req.headers.email;
    body.name = req.body.name || req.headers.name;
    body.password = req.body.password || req.headers.password;

    console.log("body", body)

    let password = body.password;
    let BCRYPT_SALT_ROUNDS = 12;

    //Check password complexity
    if (Auth.isPasswordComplex(password)) {
        bcrypt.hash(body.password, BCRYPT_SALT_ROUNDS)
            .then(hashedPassword => {
                body.password = hashedPassword;
                // Making a new user ignores random junk in body
                new User(body).save()
                .then(user => {
                    create_cart(user)
                    res.status(201).send(user)
                })
            })
            .catch(err => handleMongooseError(res, err));
    } else {
        handleMongooseError(res, Error("PasswordNotComplex"))
    }

    // Encrypt the password


});

// SIGN IN WITH GOOGLE
router.post(GOOGLE_AUTHORISE, async (req, res) => {
    console.log("GOOGLE")
    // Decode google id_token
    let id = req.headers.id_token;
    let jwt = id.split(".")[1];
    let userInfo = Buffer.from(jwt, 'base64').toString('binary');
    console.log(userInfo);
    let json = JSON.parse(userInfo);
    let email = json.email;
    let name = json.name;
    let googleID = uuid.v4();
    // Validate id_token
    if (json.iss === 'https://accounts.google.com') {
        // Check if user has account
        User.findOne({ email: json.email })
        .then(user => {
            if (user) {
                req.session.user = user
                req.query.redirect_uri = '/api/auth' + CALLBACK_URL
                Auth.oauth_authorise(req, res);
            }
            else {
                new User({ email: email, name: name, googleID: googleID }).save()
                .then(user => {
                    req.session.user = user
                    req.query.redirect_uri = '/api/auth' + CALLBACK_URL
                    create_cart(user)
                    Auth.oauth_authorise(req, res);
                })
            }
        })
        .catch(err => handleMongooseError(res, err));
    }
})

// LOGIN
router.post(LOGIN_URL, (req, res) => {
    console.log("login request recived");
    var email = req.body.email ?? req.headers.email;
    var pass = req.body.password ?? req.headers.password;

    console.log("BODY***", req.body);
    console.log("HEADERS***", req.headers);

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                var passIsValid = bcrypt.compareSync(pass, user.password);
                if (!passIsValid) {
                    throw Error("InvalidPassword")
                }
                req.session.user = user
                req.query.redirect_uri = '/api/auth' + CALLBACK_URL
                return Auth.oauth_authorise(req, res);
            }
            throw Error("EmailNotFound");
        })
        .catch(err => handleMongooseError(res, err));
});

router.get(CALLBACK_URL, (req, res) => {
    req.body.grant_type = "authorization_code";
    req.body.code = req.query.code;
    req.body.client_id = OAUTH_CLIENTID;
    req.body.user_id = req.query.userid;
    return Auth.oauth_token(req, res);
})

// LOGOUT
router.post(LOGOUT_URL, function (req, res) {
});

router.get(OAUTH_AUTHERISE_URL, function (req, res) {
    return Auth.oauth_authorise(req, res);
});

router.post(OAUTH_TOKEN_URL, function (req, res) {
    return Auth.oauth_token(req, res);
});

module.exports = router;