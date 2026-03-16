const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', authRequired, createOrder);
router.get('/user', authRequired, getUserOrders);
router.get('/admin', authRequired, adminOnly, getAllOrders);

// Admin status update alias to match spec: PUT /api/orders/:id/status
router.put('/:id/status', authRequired, adminOnly, updateOrderStatus);

module.exports = router;
