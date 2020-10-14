const Auth = require('../auth/auth');
const { User } = require('../models/user');
const { handleMongooseError } = require('../error/errorHandler');
const { Error } = require('../error/CustomMongoError');
const bcrypt = require('bcrypt');

const LOGIN_URL = "/login";
const SIGNUP_URL = "/signup";
const LOGOUT_URL = "/logout";

const CALLBACK_URL = "/callback";
const OAUTH_AUTHERISE_URL = '/oauth/authorise';
const OAUTH_TOKEN_URL = '/oauth/token';

const OAUTH_CLIENTID = "e47532c3-3c2b-4e38-a534-8b709772e4a0";

const express = require('express');
let router = express.Router();

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
                    .then(user => res.status(201).send(user))
            })
            .catch(err => handleMongooseError(res, err));
    } else {
        handleMongooseError(res, Error("PasswordNotComplex"))
    }

    // Encrypt the password


});

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
    console.log(req.query)
    req.body.code = req.query.code;
    req.body.client_id = OAUTH_CLIENTID;
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