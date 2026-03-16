require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Config
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files for images
app.use('/uploads', express.static(uploadsDir));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CozyLoops API' });
});

// Route mounts (defined after models/controllers are added)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api', require('./routes/uploadRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Error handler
app.use(errorHandler);

// Start server after DB connection
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // Optional seed on start
    if (process.env.SEED_ON_START === 'true') {
      // Lazy import to avoid circular deps
      // eslint-disable-next-line global-require
      await require('./seed/seed').seed();
    }
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`CozyLoops API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
