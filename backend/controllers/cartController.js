const User = require('../models/User');
const Product = require('../models/Product');

async function getCart(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product')
      .select('cart')
      .lean();
    const items = (user.cart || []).filter((i) => i.product).map((i) => ({
      product: i.product,
      quantity: i.quantity
    }));
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function addOrUpdateItem(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity == null || quantity < 1) {
      const err = new Error('productId and quantity (min 1) are required');
      err.status = 400;
      throw err;
    }
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    const user = await User.findById(req.user._id).select('cart');
    const cart = user.cart || [];
    const existingIndex = cart.findIndex((i) => String(i.product) === String(productId));
    const toAdd = Math.max(1, Number(quantity));
    const qty =
      existingIndex >= 0
        ? Math.min(product.stock, cart[existingIndex].quantity + toAdd)
        : Math.min(product.stock, toAdd);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity = qty;
    } else {
      cart.push({ product: productId, quantity: qty });
    }
    user.cart = cart;
    await user.save();
    const populated = await User.findById(req.user._id)
      .populate('cart.product')
      .select('cart')
      .lean();
    const items = (populated.cart || []).filter((i) => i.product).map((i) => ({
      product: i.product,
      quantity: i.quantity
    }));
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function setItemQty(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity == null) {
      const err = new Error('productId and quantity are required');
      err.status = 400;
      throw err;
    }
    const qty = Math.max(0, Number(quantity));
    const user = await User.findById(req.user._id).select('cart');
    const cart = user.cart || [];
    if (qty === 0) {
      user.cart = cart.filter((i) => String(i.product) !== String(productId));
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        const err = new Error('Product not found');
        err.status = 404;
        throw err;
      }
      const capped = Math.min(qty, product.stock);
      const existingIndex = cart.findIndex((i) => String(i.product) === String(productId));
      if (existingIndex >= 0) {
        cart[existingIndex].quantity = capped;
      } else {
        cart.push({ product: productId, quantity: capped });
      }
    }
    user.cart = cart;
    await user.save();
    const populated = await User.findById(req.user._id)
      .populate('cart.product')
      .select('cart')
      .lean();
    const items = (populated.cart || []).filter((i) => i.product).map((i) => ({
      product: i.product,
      quantity: i.quantity
    }));
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const { productId } = req.params;
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { cart: { product: productId } }
    });
    const user = await User.findById(req.user._id)
      .populate('cart.product')
      .select('cart')
      .lean();
    const items = (user.cart || []).filter((i) => i.product).map((i) => ({
      product: i.product,
      quantity: i.quantity
    }));
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });
    res.json({ success: true, items: [] });
  } catch (err) {
    next(err);
  }
}

/** Merge guest cart (array of { productId, quantity }) into user cart */
async function mergeCart(req, res, next) {
  try {
    const { items: guestItems } = req.body;
    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      return getCart(req, res, next);
    }
    const user = await User.findById(req.user._id).select('cart');
    const cart = user.cart || [];
    for (const g of guestItems) {
      const productId = g.productId || g.product;
      const quantity = Number(g.quantity) || 1;
      if (!productId) continue;
      const prod = await Product.findById(productId);
      if (!prod) continue;
      const existing = cart.find((i) => String(i.product) === String(productId));
      if (existing) {
        existing.quantity = Math.min(prod.stock, existing.quantity + quantity);
      } else {
        cart.push({ product: productId, quantity: Math.min(prod.stock, quantity) });
      }
    }
    user.cart = cart;
    await user.save();
    const populated = await User.findById(req.user._id)
      .populate('cart.product')
      .select('cart')
      .lean();
    const items = (populated.cart || []).filter((i) => i.product).map((i) => ({
      product: i.product,
      quantity: i.quantity
    }));
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCart,
  addOrUpdateItem,
  setItemQty,
  removeItem,
  clearCart,
  mergeCart
};
