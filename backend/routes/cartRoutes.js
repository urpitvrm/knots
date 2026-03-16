const express = require('express');
const { authRequired } = require('../middleware/auth');
const {
  getCart,
  addOrUpdateItem,
  setItemQty,
  removeItem,
  clearCart,
  mergeCart
} = require('../controllers/cartController');

const router = express.Router();

router.get('/', authRequired, getCart);
router.post('/merge', authRequired, mergeCart);
router.post('/', authRequired, addOrUpdateItem);
router.put('/', authRequired, setItemQty);
router.delete('/clear', authRequired, clearCart);
router.delete('/:productId', authRequired, removeItem);

module.exports = router;
