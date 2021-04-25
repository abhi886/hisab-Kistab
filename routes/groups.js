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
if (!group) return res.status(404).send('Group not found');
if(group.user.includes(req.body.memberId)) {
  return res.send('Member already exists');
  process.exit(1);
}
group.user.push(req.body.memberId)
const result = await group.save();
res.send(group);
});

// Delete members from a group

router.post('/deleteMembers', async (req, res) => {
  const group = await Group.findById(req.body.groupId);
  if (!group) return res.status(404).send('Group not found');
  const rUser = _.remove(group.user, function(e) {
    return e == req.body.memberId;
  });
  const mUser = group.user;
  group.user = [];
  group.user = mUser;
  const result = await group.save();
  res.send(group);
  });

// Delete a group 
router.post('/deleteGroup', async (req, res) => {
 const result = await Group.deleteOne({ _id: req.body.groupId});
//  console.log(result);
res.send(result);
  });

module.exports = router;
