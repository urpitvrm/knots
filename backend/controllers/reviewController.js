const Review = require('../models/Review');
const Product = require('../models/Product');

async function getProductReviews(req, res, next) {
  try {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    const product = await Product.findById(productId).select('averageRating reviewCount');
    res.json({
      success: true,
      reviews,
      averageRating: product?.averageRating ?? 0,
      reviewCount: product?.reviewCount ?? 0
    });
  } catch (err) {
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const productId = req.params.id;
    const { rating, text } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      const err = new Error('Rating must be between 1 and 5');
      err.status = 400;
      throw err;
    }
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) {
      const err = new Error('You have already reviewed this product');
      err.status = 409;
      throw err;
    }
    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      text: text || ''
    });
    await review.populate('user', 'name');
    const reviews = await Review.find({ product: productId });
    const reviewCount = reviews.length;
    const averageRating = reviews.reduce((s, r) => s + r.rating, 0) / reviewCount;
    await Product.findByIdAndUpdate(productId, { averageRating, reviewCount });
    res.status(201).json({ success: true, review, averageRating, reviewCount });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProductReviews, createReview };
