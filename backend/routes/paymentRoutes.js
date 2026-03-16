const express = require('express');
const { authRequired } = require('../middleware/auth');
const { createCheckoutSession, confirmCheckoutSession } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-checkout-session', authRequired, createCheckoutSession);
router.get('/confirm', authRequired, confirmCheckoutSession);

module.exports = router;

