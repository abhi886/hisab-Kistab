// Changed on jan 5
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

const port = process.env.PORT || 3000;
const server = app.listen(3000, () => console.log(`Listening to port ${port}`));
module.exports = server;
