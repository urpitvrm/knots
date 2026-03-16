const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const {
  validateCoupon,
  listCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/couponController');

const router = express.Router();

router.get('/validate', validateCoupon);
router.get('/', authRequired, adminOnly, listCoupons);
router.post('/', authRequired, adminOnly, createCoupon);
router.delete('/:id', authRequired, adminOnly, deleteCoupon);

module.exports = router;
