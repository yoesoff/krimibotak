'use strict';

var express = require('express'),
app = express(),
port = process.env.PORT || 8081,
bodyParser = require('body-parser'),
firebase = require('firebase');

firebase.initializeApp({
    "apiKey": "AIzaSyAOlyehZC2hFx7VqNKAXUEAkdz_rLVgI4U",
    "authDomain": "krimibotak.firebaseapp.com",
    "databaseURL": "https://krimibotak.firebaseio.com"
});

app.get('/', (req, res) => res.send('Hello World Happy Express day buddy!'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/testRoutes'); //importing route
routes(app); //register the route
var routes = require('./app/routes'); //importing route
routes(app); //register the route


const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
