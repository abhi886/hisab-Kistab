const express = require('express');

const router = express.Router();
router.get('/', async () => {
  console.log('reached here');
});

module.exports = router;
