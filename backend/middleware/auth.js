const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) {
      const err = new Error('Authentication required');
      err.status = 401;
      throw err;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      const err = new Error('User not found');
      err.status = 401;
      throw err;
    }
    req.user = user;
    next();
  } catch (err) {
    err.status = err.status || 401;
    next(err);
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    const err = new Error('Admin access required');
    err.status = 403;
    return next(err);
  }
  return next();
}

module.exports = { authRequired, adminOnly };
