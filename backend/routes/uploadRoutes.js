const express = require('express');
const path = require('path');
const { authRequired, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { uploadBuffer, isConfigured } = require('../services/cloudinaryService');

const router = express.Router();

router.post('/upload', authRequired, adminOnly, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    if (isConfigured()) {
      const { url, publicId } = await uploadBuffer(req.file.buffer);
      return res.status(201).json({ success: true, url, publicId });
    }
    const urlPath = `/uploads/${req.file.filename}`;
    const absolutePath = path.join(__dirname, '..', urlPath);
    return res.status(201).json({ success: true, url: urlPath, path: absolutePath });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/upload/product-images',
  authRequired,
  adminOnly,
  upload.array('images', 12),
  async (req, res, next) => {
    try {
      if (!req.files?.length) {
        return res.status(400).json({ success: false, message: 'No images uploaded' });
      }
      if (isConfigured()) {
        const items = await Promise.all(req.files.map((f) => uploadBuffer(f.buffer)));
        return res.status(201).json({
          success: true,
          urls: items.map((i) => i.url),
          items
        });
      }
      const urls = req.files.map((f) => `/uploads/${f.filename}`);
      const paths = urls.map((u) => path.join(__dirname, '..', u));
      return res.status(201).json({
        success: true,
        urls,
        items: urls.map((url, i) => ({ url, path: paths[i] }))
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/upload/gallery-image', authRequired, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    if (isConfigured()) {
      const { url, publicId } = await uploadBuffer(req.file.buffer);
      return res.status(201).json({ success: true, url, publicId });
    }
    const urlPath = `/uploads/${req.file.filename}`;
    return res.status(201).json({ success: true, url: urlPath });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
