const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    discountPercentage: { type: Number, required: true, min: 1, max: 90 },
    active: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Bundle', bundleSchema);
