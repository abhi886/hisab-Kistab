/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const { User } = require('../models/user');

const router = express.Router();
function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid Username or Password');
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send('Invalid Username or Password');
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
