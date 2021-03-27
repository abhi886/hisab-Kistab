/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const { User, validate } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User exists Damit');
  user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
  await user.save();
  res.send(_.pick(user, ['name', 'email']));
});
module.exports = router;
