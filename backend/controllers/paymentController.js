const Stripe = require('stripe');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

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
    const { products, shippingAddress, successUrl, cancelUrl, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      const err = new Error('Checkout requires at least one product');
      err.status = 400;
      throw err;
    }

    const productDocs = await Product.find({
      _id: { $in: products.map((p) => p.product) }
    });
    const productMap = new Map(productDocs.map((p) => [String(p._id), p]));

    let totalPrice = 0;
    const lineItems = products.map((p) => {
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
      const lineTotal = prod.price * p.quantity;
      totalPrice += lineTotal;
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: prod.name
          },
          unit_amount: Math.round(prod.price * 100)
        },
        quantity: p.quantity
      };
    });

    let discountPercentage = 0;
    if (couponCode && couponCode.trim()) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        expiryDate: { $gt: new Date() }
      });
      if (coupon) {
        discountPercentage = coupon.discountPercentage;
        const discountCents = Math.round((totalPrice * discountPercentage / 100) * 100);
        if (discountCents > 0) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Discount (${coupon.code})`
              },
              unit_amount: -discountCents
            },
            quantity: 1
          });
          totalPrice = totalPrice - (discountCents / 100);
        }
      }
    }

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
        totalPrice: String(totalPrice)
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

    const order = await Order.create({
      user: userId,
      products,
      totalPrice,
      shippingAddress,
      orderStatus: 'processing',
      payment: {
        provider: 'stripe',
        sessionId: session.id,
        amount: totalPrice
      }
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCheckoutSession,
  confirmCheckoutSession
};

