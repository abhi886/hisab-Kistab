/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const auth = require('../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const { Group, validate } = require('../models/group');
const { User } = require('../models/user');

const router = express.Router();
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const group = new Group(_.pick(req.body, ["name", "description", "user"]));
  await group.save();
res.send(req.body);
});
// get all the groups along with their members
router.get('/listMembers', async (req, res) => {
const member = await Group
.find()
.populate('user');
res.send(member);
});

// Add members/users to a group.
router.post('/addMembers', async (req, res) => {
const group = await Group.findById(req.body.groupId);
if (!group) return res.status(404).message('Group not found');
// group = group.user.push(req.body.memberId);
group.set({
  group: group.user.push(req.body.memberId)
});
const result = await group.save();
res.send(group);
});
module.exports = router;
