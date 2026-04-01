const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: { type: [orderProductSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    shippingAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    payment: {
      provider: { type: String },
      sessionId: { type: String, index: true },
      amount: { type: Number, min: 0 }
    },
    loyalty: {
      pointsEarned: { type: Number, default: 0, min: 0 },
      pointsRedeemed: { type: Number, default: 0, min: 0 }
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Order', orderSchema);
