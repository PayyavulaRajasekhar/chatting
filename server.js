const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;

// models
const models = require("./models");

// routes
const users = require('./routes/users');
const messages = require('./routes/messages');

// Sync Database
models.sequelize.sync().then(function () {
    console.log('connected to database');
}).catch(function (err) {
    console.log(err)
});

// cors middleware
app.use(cors());

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// using routes
app.use('/users', users);
app.use('/messages', messages);

// error handling middleware
app.use(function (err, req, res, next) {
    res.status(500).json({
        error: true,
        message: 'some error occurred'
    });
});

app.listen(port, function () {
    console.log('app listening on port: ' + port);
});