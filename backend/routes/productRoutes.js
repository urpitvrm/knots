const express = require('express');
const {
  listProducts,
  getProduct,
  trackRecentlyViewed,
  getRecentlyViewed,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { getProductReviews, createReview } = require('../controllers/reviewController');
const { authRequired, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', listProducts);
router.get('/recent/user', authRequired, getRecentlyViewed);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', authRequired, createReview);
router.post('/:id/recently-viewed', authRequired, trackRecentlyViewed);
router.get('/:id', getProduct);
router.post('/', authRequired, adminOnly, createProduct);
router.put('/:id', authRequired, adminOnly, updateProduct);
router.delete('/:id', authRequired, adminOnly, deleteProduct);

module.exports = router;
