const User = require('../models/User');
const Product = require('../models/Product');

async function getWishlist(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    const items = user.wishlist || [];
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function addToWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).select('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
}

async function removeFromWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).select('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
