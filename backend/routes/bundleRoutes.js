const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const { listBundles, createBundle } = require('../controllers/bundleController');

const router = express.Router();

router.get('/', listBundles);
router.post('/', authRequired, adminOnly, createBundle);

module.exports = router;
