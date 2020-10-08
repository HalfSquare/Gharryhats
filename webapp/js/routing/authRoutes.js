const express = require('express');
const getFile = require('../pageGetters/getFile');
let router = express.Router();

router.get("/login", (req, res, next) => {  
    getFile(req, res, './login/loginPage.html');
});

router.get("/signup", (req, res, next) => {
    res.send("signup");
});

router.use("/", (req, res, next) => {
    res.redirect("/auth/login");
})

module.exports = router;