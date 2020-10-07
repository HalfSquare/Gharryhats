const express = require('express');
let router = express.Router();

router.get("/login", (req, res, next) => {
    res.send("login");
});

router.get("/signup", (req, res, next) => {
    res.send("signup");
});

router.use("/", (req, res, next) => {
    res.redirect("/auth/login");
})

module.exports = router;