const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const { getMessages, getAdminChats } = require('../controllers/chatController');

const router = express.Router();

router.get('/admin', authRequired, adminOnly, getAdminChats);
router.get('/:userId', authRequired, getMessages);

module.exports = router;
