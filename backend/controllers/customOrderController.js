const CustomOrder = require('../models/CustomOrder');
const { pushNotification, pushNotificationToAdmins, emitRealtimeEvent } = require('../services/realtimeService');

async function createCustomOrder(req, res, next) {
  try {
    const { description, referenceImage = '', budget } = req.body;
    if (!description || budget == null) {
      const err = new Error('Description and budget are required');
      err.status = 400;
      throw err;
    }
    const customOrder = await CustomOrder.create({
      userId: req.user._id,
      description,
      referenceImage,
      budget: Number(budget),
      status: 'pending'
    });
    await pushNotificationToAdmins({
      type: 'new_order',
      title: 'New custom order request',
      message: `${req.user.name} requested a custom crochet order.`,
      customOrderId: String(customOrder._id)
    });
    emitRealtimeEvent('admins', 'new_order', { customOrderId: customOrder._id, type: 'custom_order' });
    res.status(201).json({ success: true, item: customOrder });
  } catch (err) {
    next(err);
  }
}

async function getUserCustomOrders(req, res, next) {
  try {
    const items = await CustomOrder.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function getAdminCustomOrders(req, res, next) {
  try {
    const items = await CustomOrder.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function updateCustomOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      const err = new Error('Invalid status');
      err.status = 400;
      throw err;
    }
    const item = await CustomOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');
    if (!item) {
      const err = new Error('Custom order not found');
      err.status = 404;
      throw err;
    }
    await pushNotification(item.userId._id, {
      type: 'order_update',
      title: 'Custom order updated',
      message: `Your custom order request is now ${status}.`,
      meta: { customOrderId: String(item._id), status }
    });
    emitRealtimeEvent(String(item.userId._id), 'order_update', {
      customOrderId: String(item._id),
      status
    });
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCustomOrder,
  getUserCustomOrders,
  getAdminCustomOrders,
  updateCustomOrderStatus
};
