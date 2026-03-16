const express = require('express');
const path = require('path');
const { authRequired, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const router = express.Router();

router.post('/upload', authRequired, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }
  const urlPath = `/uploads/${req.file.filename}`;
  const absolutePath = path.join(__dirname, '..', urlPath);
  return res.status(201).json({ success: true, url: urlPath, path: absolutePath });
});

module.exports = router;
