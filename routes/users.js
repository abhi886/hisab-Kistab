/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const auth = require('../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const { User, validate } = require('../models/user');

const router = express.Router();

router.get('/me', auth, async(req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User exists Damit');
  user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res.header('x-auth-token',token).send(_.pick(user, ['name', 'email']));
});

router.get('/getUsersId', async (req, res) => {
let allUserInfo = await User.find();
const allUserId = allUserInfo.map(userId => userId._id);
res.send(allUserId.join());
});
module.exports = router;
