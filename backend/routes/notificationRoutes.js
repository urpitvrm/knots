const express = require('express');
const { authRequired } = require('../middleware/auth');
const { getMyNotifications, markAllRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/me', authRequired, getMyNotifications);
router.put('/me/read-all', authRequired, markAllRead);

module.exports = router;
