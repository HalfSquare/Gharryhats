const express = require('express');
const cors = require('cors');
const getFile = require('../pageGetters/getFile');
const getLogin = require('../pageGetters/getLogin');
const getSignup = require('../pageGetters/getSignup');
let router = express.Router();

router.get("/login", (req, res, next) => {
    getLogin(req, res, './login/loginPage.html', './login/js/loginController.js');
});

router.options('/login', cors());
router.post("/login", cors(), (req, res) => {
    console.log("\n***login post***");
    let email = req.headers.email;
    let password = req.headers.password;

    console.log("email: ", email)
    console.log("password: ", password)
    res.send(JSON.stringify({
        email: email,
        password: password
    }));
})

router.get("/signup", (req, res, next) => {
    getSignup(req, res, './signup/signupPage.html', './signup/js/signupController.js');
});

router.get("/signupDone", (req, res, next) => {
    getFile(req, res, './signup/signupSuccessful.html')
    // res.send("Sign Up Siccessful!");
});

router.use("/", (req, res, next) => {
    res.redirect("/auth/login");
})

module.exports = router;