/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const { isArray, reject } = require('lodash');
const e = require('express');
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

// router.post('/addMembers', async (req, res) => {
//   const { memberId } = req.body;
//   const userExist = [];
//   const group = await Group.findById(req.body.groupId);
//   const totalLength = memberId.concat(group.user);
//   if (!group) return res.status(404).send('Group not found');
//   if (memberId.length === 0)
//     return res.send('Select atleast one group members');

//   memberId.forEach((user) => {
//     if (group.user.includes(user)) {
//       userExist.push(user);
//     } else {
//       group.user = group.user.concat(user);
//     }
//   });

//   if (group.user.length === totalLength.length) {
//     const result = await group.save();
//     res.send(result);
//   } else {
//     res.send(userExist);
//   }
// });

// Async approach with try catch
router.post('/addMembers', async (req, res) => {
  const { memberId } = req.body;
  const userExist = [];
  if (req.body.groupId === '')
    return res.status(404).send('Group cannot be empty');
  const group = await Group.findById(req.body.groupId);
  const users = group.user;
  if (!group) return res.status(404).send('Group not found');
  if (memberId.length === 0)
    return res.send('Select atleast one group members');
  try {
    for (let i = 0; i < memberId.length; i += 1) {
      const eachMember = memberId[i];
      if (users.includes(eachMember)) {
        userExist.push(eachMember);
      }
    }
    if (userExist.length === 0) {
      group.user = group.user.concat(memberId);
      const result = await group.save();
      res.send(result);
    } else {
      res.send(userExist);
    }
  } catch (error) {
    console.log(error.message);
  }
});
// Synchronous Method to delete members in a group
// router.post('/deleteMembers', async (req, res) => {
//   const group = await Group.findById(req.body.groupId);
//   if (!group) return res.status(404).send('Group not found');
//   const { memberId } = req.body;
//   const users = group.user;
//   if (memberId.length === 0) res.send('No members Selected');
//   const notMemberArray = [];
//   memberId.forEach((user) => {
//     if (group.user.includes(user)) {
//       users.remove(user);
//     } else {
//       notMemberArray.push(user);
//     }
//   });
//   if (notMemberArray.length === 0) {
//     const result = await group.save();
//     res.send(users);
//   } else {
//     res.send(notMemberArray);
//   }
// });
// Asynchronous Method to delete members in a group
router.post('/deleteMembers', async (req, res) => {
  const group = await Group.findById(req.body.groupId);
  if (!group) return res.status(404).send('Group not found');
  const { memberId } = req.body;
  const users = group.user;
  const notMember = [];
  if (memberId.length === 0) res.send('No members Selected');

  try {
    for (let i = 0; i < memberId.length; i += 1) {
      const eachMember = memberId[i];
      if (users.includes(eachMember)) {
        users.remove(eachMember);
      } else {
        notMember.push(eachMember);
      }
    }
    if (notMember.length === 0) {
      const result = await group.save();
      res.send(result);
    } else {
      res.send(notMember);
    }
  } catch (error) {
    console.log(error.message);
  }
});

// Delete a group
router.post('/deleteGroup', async (req, res) => {
  const result = await Group.deleteOne({ _id: req.body.groupId });
  //  console.log(result);
  res.send(result);
});

module.exports = router;
