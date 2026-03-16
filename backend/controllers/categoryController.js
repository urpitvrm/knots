const Category = require('../models/Category');

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) {
      const err = new Error('Category name is required');
      err.status = 400;
      throw err;
    }
    const existing = await Category.findOne({ name });
    if (existing) {
      const err = new Error('Category already exists');
      err.status = 409;
      throw err;
    }
    const category = await Category.create({ name });
    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!category) {
      const err = new Error('Category not found');
      err.status = 404;
      throw err;
    }
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      const err = new Error('Category not found');
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
