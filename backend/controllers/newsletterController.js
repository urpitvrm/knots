const Subscriber = require('../models/Subscriber');

async function subscribe(req, res, next) {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      const err = new Error('Email is required');
      err.status = 400;
      throw err;
    }
    const normalized = email.trim().toLowerCase();
    const existing = await Subscriber.findOne({ email: normalized });
    if (existing) {
      return res.json({ success: true, message: 'Already subscribed' });
    }
    await Subscriber.create({ email: normalized });
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { subscribe };
