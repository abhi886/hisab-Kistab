const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const router = express.Router();
router.use(fileUpload());

router.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  console.log('req.files >>>', req.files);
  const { sampleFile } = req.files;
  const uploadPath = `${path.dirname(__dirname)}/uploads/${sampleFile.name}`;
  console.log(uploadPath);
  sampleFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(`File uploaded to ${uploadPath}`);
  });
});
module.exports = router;
