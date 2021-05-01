/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const { isArray } = require('lodash');
const { Group, validate } = require('../models/group');
const { User } = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const group = new Group(_.pick(req.body, ['name', 'description', 'user']));
  await group.save();
  res.send(req.body);
});
// get all the groups along with their members
router.get('/listMembers', async (req, res) => {
  const member = await Group.find().populate('user');
  res.send(member);
});

// Add multiple members/users to a group
// Test Cases : 1. Add a single member
// Test Cases 2 : Add multiple members
// Test Case 3 : Return message if member exist

router.post('/addMembers', async (req, res) => {
  const { memberId } = req.body;
  const userExist = [];
  const group = await Group.findById(req.body.groupId);
  const totalLength = memberId.concat(group.user);
  if (!group) return res.status(404).send('Group not found');
  if (memberId.length === 0)
    return res.send('Select atleast one group members');

  memberId.forEach(function (memberId) {
    if (group.user.includes(memberId)) {
      userExist.push(memberId);
    } else {
      group.user = group.user.concat(memberId);
    }
  });

  if (group.user.length === totalLength.length) {
    const result = await group.save();
    res.send(result);
  } else {
    res.send(userExist);
  }
});

// Delete members from a group

// router.post('/deleteMembers', async (req, res) => {
//   const group = await Group.findById(req.body.groupId);
//   if (!group) return res.status(404).send('Group not found');
//   const rUser = _.remove(group.user, function(e) {
//     return e == req.body.memberId;
//   });
//   const mUser = group.user;
//   group.user = [];
//   group.user = mUser;
//   const result = await group.save();
//   res.send(group);
//   });

// Delete multiple members from a group
// Test Cases
// 1. Delete a single user.
// 2. Delete multiple users.

router.post('/deleteMembers', async (req, res) => {
  const group = await Group.findById(req.body.groupId);
  if (!group) return res.status(404).send('Group not found');
  const { memberId } = req.body;
  const users = group.user;
  if (memberId.length === 0) res.send('No members Selected');
  const notMemberArray = [];
  // eslint-disable-next-line no-shadow
  memberId.forEach((memberId) => {
    if (group.user.includes(memberId)) {
      users.remove(memberId);
    } else {
      notMemberArray.push(memberId);
    }
  });
  if (notMemberArray.length === 0) {
    const result = await group.save();
    res.send(users);
  } else {
    res.send(notMemberArray);
  }
});

// Delete a group
router.post('/deleteGroup', async (req, res) => {
  const result = await Group.deleteOne({ _id: req.body.groupId });
  //  console.log(result);
  res.send(result);
});

module.exports = router;
