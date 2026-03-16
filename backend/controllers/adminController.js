const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const LOW_STOCK_THRESHOLD = 5;

async function stats(req, res, next) {
  try {
    const [users, products, orders, revenueAgg, lowStockProducts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $match: {
            orderStatus: { $in: ['processing', 'shipped', 'delivered'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' }
          }
        }
      ]),
      Product.find({ stock: { $gte: 0, $lte: LOW_STOCK_THRESHOLD } })
        .select('name stock')
        .limit(20)
    ]);

    const revenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        users,
        products,
        orders,
        revenue,
        lowStockCount: lowStockProducts.length,
        lowStockProducts
      }
    });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Math.min(Number(req.query.limit || 20), 100);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments()
    ]);
    res.json({ success: true, items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

module.exports = { stats, listUsers };
