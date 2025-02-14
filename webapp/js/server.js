const dbOp = require('./dbOperations');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');

const mainRoutes = require('./routing/mainRoutes');
const authRoutes = require('./routing/authRoutes');
const whitelist = ['https://limitless-cove-65021.herokuapp.com', 'https://gharryhats.herokuapp.com', 'http://localhost:3000'];//git

dbOp.connect();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        console.log('origin', origin)
        if (!origin) return callback(null, true);
        if (whitelist.indexOf(origin) === -1) {
            var message = "The CORS policy for this origin doesn't " +
                'allow access from the particular origin.';
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));


app.use('/auth', authRoutes);

app.use('/', mainRoutes);

app.listen(process.env.PORT || 3000);
console.log("Hosted on port ", process.env.PORT || 3000);