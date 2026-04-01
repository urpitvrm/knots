const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { pushNotification, pushNotificationToAdmins, emitRealtimeEvent } = require('../services/realtimeService');

async function createOrder(req, res, next) {
  try {
    const { products, shippingAddress } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      const err = new Error('Order must include products');
      err.status = 400;
      throw err;
    }
    // Validate products and compute total
    let totalPrice = 0;
    const productDocs = await Product.find({
      _id: { $in: products.map((p) => p.product) }
    });
    const productMap = new Map(productDocs.map((p) => [String(p._id), p]));
    for (const p of products) {
      const prod = productMap.get(String(p.product));
      if (!prod) {
        const err = new Error('One or more products not found');
        err.status = 400;
        throw err;
      }
      if (prod.stock < p.quantity) {
        const err = new Error(`Insufficient stock for ${prod.name}`);
        err.status = 400;
        throw err;
      }
      totalPrice += prod.price * p.quantity;
    }
    // Decrement stock
    for (const p of products) {
      await Product.findByIdAndUpdate(p.product, { $inc: { stock: -p.quantity } });
    }
    const order = await Order.create({
      user: req.user._id,
      products,
      totalPrice,
      shippingAddress,
      orderStatus: 'pending',
      loyalty: { pointsEarned: Math.floor(totalPrice), pointsRedeemed: 0 }
    });
    await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: Math.floor(totalPrice) } });
    await pushNotification(req.user._id, {
      type: 'new_order',
      title: 'Order placed',
      message: `Your order #${order._id.toString().slice(-6)} has been placed.`,
      meta: { orderId: String(order._id) }
    });
    await pushNotificationToAdmins({
      type: 'new_order',
      title: 'New order received',
      message: `Order #${order._id.toString().slice(-6)} was created.`,
      orderId: String(order._id)
    });
    emitRealtimeEvent('admins', 'new_order', order);
    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

async function getUserOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find().populate('user').populate('products.product').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      const err = new Error('Invalid order status');
      err.status = 400;
      throw err;
    }
    const order = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true })
      .populate('user')
      .populate('products.product');
    if (!order) {
      const err = new Error('Order not found');
      err.status = 404;
      throw err;
    }
    await pushNotification(order.user._id, {
      type: 'order_update',
      title: 'Order status updated',
      message: `Your order is now ${status}.`,
      meta: { orderId: String(order._id), status }
    });
    emitRealtimeEvent(order.user._id, 'order_update', { orderId: String(order._id), status });
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

function estimateDelivery(req, res) {
  const country = (req.query.country || '').toLowerCase();
  let estimate = 'Delivery in 5-7 days';
  if (['india', 'in'].includes(country)) estimate = 'Delivery in 3-5 days';
  if (['us', 'usa', 'united states'].includes(country)) estimate = 'Delivery in 5-8 days';
  if (['uk', 'united kingdom'].includes(country)) estimate = 'Delivery in 6-9 days';
  res.json({ success: true, estimate });
}

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  estimateDelivery
};
