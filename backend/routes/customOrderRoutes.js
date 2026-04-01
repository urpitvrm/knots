const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const {
  createCustomOrder,
  getUserCustomOrders,
  getAdminCustomOrders,
  updateCustomOrderStatus
} = require('../controllers/customOrderController');

const router = express.Router();

router.post('/', authRequired, createCustomOrder);
router.get('/user', authRequired, getUserCustomOrders);
router.get('/admin', authRequired, adminOnly, getAdminCustomOrders);
router.put('/:id/status', authRequired, adminOnly, updateCustomOrderStatus);

module.exports = router;
