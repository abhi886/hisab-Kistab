// Changed on jan 5
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB. This is just a test.
// Would be removed after the real connection to the mongodb.changes
mongoose
  .connect('mongodb://algo-app-mongodb:27017/test', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.log('error found');
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send('hello world');
});

const port = process.env.PORT || 3000;
const server = app.listen(3000, () => console.log(`Listening to port ${port}`));
module.exports = server;
