const Notification = require('../models/Notification');

async function getMyNotifications(req, res, next) {
  try {
    const items = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function markAllRead(req, res, next) {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { $set: { read: true } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyNotifications, markAllRead };
