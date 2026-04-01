const Stripe = require('stripe');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { pushNotification, pushNotificationToAdmins, emitRealtimeEvent } = require('../services/realtimeService');

const POINT_VALUE_USD = 0.1;

const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe =
  secretKey && String(secretKey).trim().length > 0
    ? new Stripe(secretKey.trim())
    : null;

async function createCheckoutSession(req, res, next) {
  try {
    if (!stripe) {
      const err = new Error('Stripe is not configured. Set STRIPE_SECRET_KEY in .env');
      err.status = 503;
      throw err;
    }
    const { products, shippingAddress, successUrl, cancelUrl, couponCode, redeemPoints = 0 } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      const err = new Error('Checkout requires at least one product');
      err.status = 400;
      throw err;
    }

    const productDocs = await Product.find({
      _id: { $in: products.map((p) => p.product) }
    });
    const productMap = new Map(productDocs.map((p) => [String(p._id), p]));

    let subtotal = 0;
    const validatedItems = products.map((p) => {
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
      const quantity = Number(p.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        const err = new Error(`Invalid quantity for ${prod.name}`);
        err.status = 400;
        throw err;
      }
      const unitAmount = Math.round(prod.price * 100);
      subtotal += unitAmount * quantity;
      return { product: prod, quantity, unitAmount };
    });

    let discountPercentage = 0;
    let appliedCouponCode = null;
    if (couponCode && couponCode.trim()) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        expiryDate: { $gt: new Date() }
      });
      if (coupon) {
        discountPercentage = coupon.discountPercentage;
        appliedCouponCode = coupon.code;
      }
    }

    const multiplier = Math.max(0, 1 - (discountPercentage / 100));
    const lineItems = validatedItems.map((item) => {
      const discountedUnitAmount = Math.max(0, Math.round(item.unitAmount * multiplier));
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name
          },
          unit_amount: discountedUnitAmount
        },
        quantity: item.quantity
      };
    });
    const discountedTotalCents = lineItems.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0);
    const user = await User.findById(req.user._id).select('loyaltyPoints');
    const safeRedeemPoints = Math.max(0, Number(redeemPoints) || 0);
    const maxRedeemablePoints = Math.min(
      user?.loyaltyPoints || 0,
      Math.floor(discountedTotalCents / Math.round(POINT_VALUE_USD * 100))
    );
    const redeemedPoints = Math.min(safeRedeemPoints, maxRedeemablePoints);
    const redeemedAmountCents = redeemedPoints * Math.round(POINT_VALUE_USD * 100);
    const totalPriceCents = Math.max(0, discountedTotalCents - redeemedAmountCents);
    const totalPrice = totalPriceCents / 100;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: req.user.email,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId: String(req.user._id),
        products: JSON.stringify(products),
        shippingAddress: JSON.stringify(shippingAddress || {}),
        totalPrice: String(totalPrice),
        subtotal: String(subtotal / 100),
        discountPercentage: String(discountPercentage),
        couponCode: appliedCouponCode || '',
        redeemedPoints: String(redeemedPoints)
      }
    });

    res.status(201).json({ success: true, url: session.url });
  } catch (err) {
    next(err);
  }
}

async function confirmCheckoutSession(req, res, next) {
  try {
    if (!stripe) {
      const err = new Error('Stripe is not configured. Set STRIPE_SECRET_KEY in .env');
      err.status = 503;
      throw err;
    }
    const { session_id: sessionId } = req.query;
    if (!sessionId) {
      const err = new Error('Missing session_id');
      err.status = 400;
      throw err;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== 'paid') {
      const err = new Error('Payment not completed');
      err.status = 400;
      throw err;
    }

    const existingOrder = await Order.findOne({ 'payment.sessionId': session.id });
    if (existingOrder) {
      return res.json({ success: true, order: existingOrder });
    }

    const products = JSON.parse(session.metadata.products || '[]');
    const shippingAddress = JSON.parse(session.metadata.shippingAddress || '{}');
    const userId = session.metadata.userId;

    if (!Array.isArray(products) || products.length === 0 || !userId) {
      const err = new Error('Invalid session metadata');
      err.status = 400;
      throw err;
    }

    const productDocs = await Product.find({
      _id: { $in: products.map((p) => p.product) }
    });
    const productMap = new Map(productDocs.map((p) => [String(p._id), p]));

    let totalPrice = 0;
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

    for (const p of products) {
      await Product.findByIdAndUpdate(p.product, { $inc: { stock: -p.quantity } });
    }

    const redeemedPoints = Number(session.metadata.redeemedPoints || 0);
    const finalAmount = Number(session.metadata.totalPrice || totalPrice);
    const order = await Order.create({
      user: userId,
      products,
      totalPrice: finalAmount,
      shippingAddress,
      orderStatus: 'processing',
      loyalty: {
        pointsEarned: Math.floor(finalAmount),
        pointsRedeemed: redeemedPoints
      },
      payment: {
        provider: 'stripe',
        sessionId: session.id,
        amount: finalAmount
      }
    });

    const pointsEarned = Math.floor(finalAmount);
    await User.findByIdAndUpdate(userId, {
      $inc: { loyaltyPoints: pointsEarned - redeemedPoints }
    });
    await pushNotification(userId, {
      type: 'order_update',
      title: 'Order placed',
      message: `Your order has been confirmed. You earned ${pointsEarned} points.`,
      meta: { orderId: String(order._id), status: order.orderStatus }
    });
    await pushNotificationToAdmins({
      type: 'new_order',
      title: 'New order received',
      message: `A new order was placed by ${session.customer_email || 'customer'}.`,
      orderId: String(order._id)
    });
    emitRealtimeEvent('admins', 'new_order', order);

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCheckoutSession,
  confirmCheckoutSession
};

