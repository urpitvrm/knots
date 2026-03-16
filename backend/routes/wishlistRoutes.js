const express = require('express');
const { authRequired } = require('../middleware/auth');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');

const router = express.Router();

router.get('/', authRequired, getWishlist);
router.post('/:productId', authRequired, addToWishlist);
router.delete('/:productId', authRequired, removeFromWishlist);

module.exports = router;
