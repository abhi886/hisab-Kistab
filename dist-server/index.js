"use strict";

// Changed on jan 5
var express = require('express');

var app = express();
app.get('/', function (req, res) {
  res.send('hello world');
});
var port = process.env.PORT || 3000;
app.listen(3000, function () {
  return console.log("Listening to port ".concat(port));
});