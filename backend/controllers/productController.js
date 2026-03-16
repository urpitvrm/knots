const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

async function listProducts(req, res, next) {
  try {
    const {
      search = '',
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sort = 'createdAt:desc',
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      if (mongoose.isValidObjectId(category)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ name: category });
        if (cat) filter.category = cat._id;
      }
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating != null && minRating !== '') {
      filter.averageRating = { $gte: Number(minRating) };
    }
    if (inStock === 'true' || inStock === true) {
      filter.stock = { $gt: 0 };
    }

    const [sortField, sortDir] = sort.split(':');
    const sortObj = { [sortField]: sortDir === 'asc' ? 1 : -1 };

    const pageNum = Number(page) || 1;
    const pageSize = Math.min(Number(limit) || 12, 50);
    const skip = (pageNum - 1) * pageSize;

    const [items, total] = await Promise.all([
      Product.find(filter).populate('category').sort(sortObj).skip(skip).limit(pageSize),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize)
    });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const item = await Product.findById(req.params.id).populate('category');
    if (!item) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, category, images = [], stock = 0 } = req.body;
    if (!name || !description || price == null || !category) {
      const err = new Error('Missing required fields');
      err.status = 400;
      throw err;
    }
    if (!mongoose.isValidObjectId(category)) {
      const err = new Error('Invalid category');
      err.status = 400;
      throw err;
    }
    const cat = await Category.findById(category);
    if (!cat) {
      const err = new Error('Invalid category');
      err.status = 400;
      throw err;
    }
    const product = await Product.create({
      name,
      description,
      price,
      category: cat._id,
      images,
      stock
    });
    res.status(201).json({ success: true, item: product });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { category, ...rest } = req.body;
    const update = { ...rest };
    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        const err = new Error('Invalid category');
        err.status = 400;
        throw err;
      }
      const cat = await Category.findById(category);
      if (!cat) {
        const err = new Error('Invalid category');
        err.status = 400;
        throw err;
      }
      update.category = cat._id;
    }
    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    res.json({ success: true, item: product });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
