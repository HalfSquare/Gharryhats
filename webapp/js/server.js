const dbOp = require('./dbOperations');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const mainRoutes = require('./routing/mainRoutes');
const authRoutes = require('./routing/authRoutes');

dbOp.connect();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', authRoutes);

app.use('/', mainRoutes);

app.listen(process.env.PORT || 3000);