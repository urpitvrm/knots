const Coupon = require('../models/Coupon');

async function validateCoupon(req, res, next) {
  try {
    const { code } = req.query;
    if (!code || !code.trim()) {
      const err = new Error('Coupon code is required');
      err.status = 400;
      throw err;
    }
    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      expiryDate: { $gt: new Date() }
    });
    if (!coupon) {
      const err = new Error('Invalid or expired coupon');
      err.status = 404;
      throw err;
    }
    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage
      }
    });
  } catch (err) {
    next(err);
  }
}

async function listCoupons(req, res, next) {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    next(err);
  }
}

async function createCoupon(req, res, next) {
  try {
    const { code, discountPercentage, expiryDate } = req.body;
    if (!code || discountPercentage == null || !expiryDate) {
      const err = new Error('code, discountPercentage, and expiryDate are required');
      err.status = 400;
      throw err;
    }
    const normalizedCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: normalizedCode });
    if (existing) {
      const err = new Error('Coupon code already exists');
      err.status = 409;
      throw err;
    }
    const coupon = await Coupon.create({
      code: normalizedCode,
      discountPercentage: Number(discountPercentage),
      expiryDate: new Date(expiryDate)
    });
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    next(err);
  }
}

async function deleteCoupon(req, res, next) {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      const err = new Error('Coupon not found');
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { validateCoupon, listCoupons, createCoupon, deleteCoupon };
