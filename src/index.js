// Changed on jan 5
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const users = require('../routes/users');
const auth = require('../routes/auth.js');

const app = express();
if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: JWT not defined');
  process.exit(1);
}
// Connect to MongoDB. This is just a test.
// Would be removed after the real connection to the mongodb.changes
mongoose
  .connect('mongodb://localhost/test', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.log('error found');
    console.log(err);
  });
app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);

app.get('/', (req, res) => {
  res.send('hellooo world');
});

const port = process.env.PORT || 3000;
const server = app.listen(3000, () => console.log(`Listening to port ${port}`));
module.exports = server;
