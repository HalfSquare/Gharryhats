const { Hat } = require("../models/hat");
const { Cart } = require("../models/cart");
const { handleError, handleMongooseError } = require("../error/errorHandler");
const Auth = require("../auth/auth");
const HATS_URL = "/hats";
const HAT_BY_ID_URL = "/hats/:id";

const express = require("express");
let router = express.Router();

router.get(HATS_URL, function (req, res) {
  console.log("Recived GET request");

  Hat.find({})
    .then((hats) => res.status(200).json(hats))
    .catch((err) => handleError(res, err, "Error in finding hats"));
});

// POST
router.post(HATS_URL, function (req, res) {
  console.log("Recived POST request");

  // Authenticate user
  Auth.validateUser(req.headers)
    .then(() => {
      req.body.createDate = new Date();
      return Hat(req.body).save();
    })
    .then((hat) => res.status(201).send(hat))
    .catch((err) => handleMongooseError(res, err));
});

// by id

// GET
router.get(HAT_BY_ID_URL, function (req, res) {
  console.log("Recived GET:id request");

  var id = req.params.id;

  Hat.findById(id)
    .then((user) => res.status(user ? 200 : 404).json(user || {}))
    .catch((err) => handleMongooseError(res, err));
});

// PUT
router.put(HAT_BY_ID_URL, function (req, res) {
  console.log("Recived POST request");

  let updateQuery = { _id: req.params.id };

  // Authenticate user
  Auth.validateUser(req.headers)
    .then(() => Hat.updateOne(updateQuery, req.body))
    .then(() => Hat.findById(req.params.id))
    .then((update) => res.status(200).send(update))
    .catch((err) => handleMongooseError(res, err));
});

// DELETE
router.delete(HAT_BY_ID_URL, function (req, res) {
  console.log("Recived DELETE request");

  // Authenticate user
  Auth.validateUser(req.headers)
    .then(() => Hat.findById(req.params.id))
    .then((user) => {
      if (!user) {
        throw Error("HatNotFound");
      }
      return user.remove();
    })
    .then((deleted) => res.status(200).send(deleted))
    .catch((err) => handleMongooseError(res, err));
});

router.get("/cart", function (req, res) {
  Auth.validateUser(req.headers).then(() => {
    let id = req.body.userId; // TODO
    Cart.findOne({ userId: id }).then((cart) => {
      if (cart) {
        res.status(200).json(cart.items);
      }
    });
  });
});

module.exports = router;
