const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const { listUsers } = require('../controllers/adminController');

const router = express.Router();

// GET /api/users (admin)
router.get('/', authRequired, adminOnly, listUsers);

module.exports = router;

