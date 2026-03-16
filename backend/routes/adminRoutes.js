const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const { stats, listUsers } = require('../controllers/adminController');
const { updateOrderStatus } = require('../controllers/orderController');
const router = express.Router();

router.get('/stats', authRequired, adminOnly, stats);
router.get('/users', authRequired, adminOnly, listUsers);
router.put('/orders/:id/status', authRequired, adminOnly, updateOrderStatus);

module.exports = router;
