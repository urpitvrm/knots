const express = require('express');
const { authRequired, adminOnly } = require('../middleware/auth');
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const router = express.Router();

router.get('/', listCategories);
router.post('/', authRequired, adminOnly, createCategory);
router.put('/:id', authRequired, adminOnly, updateCategory);
router.delete('/:id', authRequired, adminOnly, deleteCategory);

module.exports = router;
