const express = require('express');
const { authRequired } = require('../middleware/auth');
const { createGalleryPost, listGallery, toggleLike } = require('../controllers/galleryController');

const router = express.Router();

router.get('/', listGallery);
router.post('/', authRequired, createGalleryPost);
router.post('/:id/like', authRequired, toggleLike);

module.exports = router;
