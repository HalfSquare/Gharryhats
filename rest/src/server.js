const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const hatRoutes = require('./routing/hatRoutes');
const authRoutes = require('./routing/authRoutes');

var cookieParser = require('cookie-parser');
var session = require('express-session');

const app = express();
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'anythingWeWant',
  resave: false,
  saveUninitialized: false
}));

// For accessing the live database locally
// process.env.MONGODB_URI = "mongodb+srv://herokuRestNode:KnND571lRn10cZDk@nwen304-shop-db.f9hmb.mongodb.net/store?retryWrites=true&w=1";
// process.env.PORT = 8080;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true, authMechanism: 'SCRAM-SHA-1' })
  .then(() => app.listen(process.env.PORT || 8080))
  .then(server => console.log("Running on port ", server.address().port))
  .catch(err => console.error('Something went wrong', err));



app.use('/api/auth', authRoutes);

app.use('/api', hatRoutes);