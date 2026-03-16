const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      const err = new Error('Name, email, and password are required');
      err.status = 400;
      throw err;
    }
    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('Email already in use');
      err.status = 409;
      throw err;
    }
    const isFirstUser = (await User.countDocuments()) === 0;
    const user = await User.create({
      name,
      email,
      password,
      role: isFirstUser ? 'admin' : 'user' // first user becomes admin
    });
    const token = signToken(user);
    res.status(201).json({ success: true, user: user.toJSON(), token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.status = 400;
      throw err;
    }
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }
    const match = await user.comparePassword(password);
    if (!match) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }
    const token = signToken(user);
    res.json({ success: true, user: user.toJSON(), token });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
