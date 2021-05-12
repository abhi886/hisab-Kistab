const readline = require('readline');
const express = require('express');
const { User } = require('../models/user');
const { url } = require('inspector');

const router = express.Router();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
router.get('/example1', async () => {
  console.log(
    'Testing asynchronous function with readline module and its awesome'
  );
  rl.question('How do you like Node ??', (answer) => {
    console.log(`Your answer: ${answer}`);
  });
  console.log('Execute before');
});

router.get('/example2', async () => {
  const a = ['a1', 'a2', 'a3'];
  try {
    for (let i = 0; i < a.length; i += 1) {
      const b = a[i];
      const result = await User.findOne();
      console.log(`${b}: ${result.name}`);
    }
    console.log('Done the loop');
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
