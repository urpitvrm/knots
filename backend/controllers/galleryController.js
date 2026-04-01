const Gallery = require('../models/Gallery');

async function createGalleryPost(req, res, next) {
  try {
    const { image, caption = '' } = req.body;
    if (!image) {
      const err = new Error('Image is required');
      err.status = 400;
      throw err;
    }
    const item = await Gallery.create({
      userId: req.user._id,
      image,
      caption
    });
    res.status(201).json({ success: true, item });
  } catch (err) {
    next(err);
  }
}

async function listGallery(req, res, next) {
  try {
    const items = await Gallery.find().populate('userId', 'name').sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function toggleLike(req, res, next) {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      const err = new Error('Gallery item not found');
      err.status = 404;
      throw err;
    }
    const userId = String(req.user._id);
    const liked = item.likes.some((u) => String(u) === userId);
    if (liked) {
      item.likes = item.likes.filter((u) => String(u) !== userId);
    } else {
      item.likes.push(req.user._id);
    }
    await item.save();
    res.json({ success: true, likes: item.likes.length, liked: !liked });
  } catch (err) {
    next(err);
  }
}

module.exports = { createGalleryPost, listGallery, toggleLike };
