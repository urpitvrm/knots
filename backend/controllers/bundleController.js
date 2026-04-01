const Bundle = require('../models/Bundle');

async function listBundles(req, res, next) {
  try {
    const filter = req.user?.role === 'admin' ? {} : { active: true };
    const items = await Bundle.find(filter).populate('products', 'name price images').sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function createBundle(req, res, next) {
  try {
    const { name, products, discountPercentage, active = true } = req.body;
    if (!name || !Array.isArray(products) || products.length < 2 || !discountPercentage) {
      const err = new Error('name, products (2+), and discountPercentage are required');
      err.status = 400;
      throw err;
    }
    const item = await Bundle.create({
      name,
      products,
      discountPercentage: Number(discountPercentage),
      active: Boolean(active)
    });
    res.status(201).json({ success: true, item });
  } catch (err) {
    next(err);
  }
}

module.exports = { listBundles, createBundle };
