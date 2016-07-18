'use strict';

var express = require('express');
var app = express();
var firebase = require('firebase');
var firebaseConfig = require('./firebase.json');
var port = 3000;
var cors = require('cors')

var firebaseApp = firebase.initializeApp(firebaseConfig.database);

// Make firebase available per request
app.use(function(req, res, next) {
  req.firebase = firebaseApp;
  next();
});

app.use(express.static('public'));

app.use(express.static('cors'));

app.use('/turn', require('./controllers/post'));

app.listen(port, function() {
  console.log('Express listening on port ' + port);
});
