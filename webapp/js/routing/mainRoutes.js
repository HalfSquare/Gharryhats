const express = require("express");
const dbOp = require("../dbOperations");

const getFile = require("../pageGetters/getFile");
const getShop = require("../pageGetters/getShop");
const getItem = require("../pageGetters/getItem");
const getImg = require("../pageGetters/getImg");
const getError = require("../pageGetters/getError");
const getCart = require("../pageGetters/getCart");
const getLogin = require("../pageGetters/getLogin");
const getJs = require("../pageGetters/getJs");
// const token = require("../../../rest/src/models/oAuth/token");

const fetch = require("node-fetch");

// Define the router
let router = express.Router();

// Shop
router.get("/shop", (req, res, next) => {
  dbOp
    .getAll()
    .then((hats) => getShop(req, res, "./shop.html", hats))
    .catch((err) => getError(req, res, err));
});

// Get Image
router.get("/img/:image", (req, res, next) => {
  getImg(req, res, "./img/" + req.params.image);
});

// Get hat
// router.get('/hat/:hatid', (req, res, next) => {
//     dbOp.getItem(req.params.hatid)
//                 .then(hat => getItem(req, res, './shop.html', hat))
//                 .catch(err => getError(req, res, err));
// });

// Get hat
router.get('/hat/:hatid', async (req, res, next) => {
    let hatItem;
    console.log('hatitem: ' + hatItem);
    await dbOp.getItem(req.params.hatid)
                .then(hat => hatItem = hat)
                .catch(err => getError(req, res, err));
                console.log('hatitem AFTER: ', hatItem);
    await dbOp.getRelated(hatItem[0].animal)
                .then(animal => getItem(req, res, './shop.html', hatItem, animal))
                .catch(err => getError(req, res, err));
});

// Get cart
router.get("/cart", async (req, res) => {
  console.log(req.headers.cookie);
  let cookie = req.headers.cookie;
  var name = "token=";
  let ca = cookie.split("; ");
  let token;
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      token = c.substring(name.length, c.length);
    }
  }
  if (token) {
    let cartUrl = 'https://limitless-cove-65021.herokuapp.com/api/cart';
    // let cartUrl = "http://localhost:8080/api/cart";
    var headers = {
      "Content-Type": "applocation/json",
      Accept: "application/json, text/plain, */*",
      token: token,
    };

    let requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };

    let response;
    await fetch(cartUrl, requestOptions)
      .then((result) => {
        response = result;
        //console.log(result.json());
        return result.text();
      })
      .then((result) => getCart(req, res, './cart.html', result))
      .catch((err) => console.log("error", err));
  } else {
    getCart(req, res, "./cart.html");
  }
});

function getCookie(cookie) {
  var name = cookie + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Login redirect
router.get("/login", (req, res) => {
  res.redirect("/auth/login");
});

const GOOGLE_OAUTH_CALLBACK = "/google/callback";

router.use(GOOGLE_OAUTH_CALLBACK, (req, res) => {
  getLogin(
    req,
    res,
    "./login/googleAuthLoginPage.html",
    "./login/js/googleAuthLoginController.js"
  );
});

router.get("/js/cookies.js", (req, res) => {
  getJs(req, res, "./js/cookies.js");
});

// Default
router.use("/", (req, res, next) => {
  // console.log(req.params);
  getFile(req, res, "./main/index.html");
});

module.exports = router;
