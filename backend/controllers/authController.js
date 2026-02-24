const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { roles } = require('../models/User');

const FIXED_ADMIN_EMAIL = 'agri@gmail.com';
const FIXED_ADMIN_PASSWORD = 'agri@123';

function signToken(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_SECRET in environment');
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

async function signup(req, res, next) {
  try {
    const { name, email, phone = '', password, role = 'user' } = req.body;

    if (!roles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin signup is disabled. Use fixed admin credentials.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, phone, password, role });
    const token = signToken(user);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;

    if (role === 'admin') {
      if (email !== FIXED_ADMIN_EMAIL || password !== FIXED_ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Incorrect admin id or password' });
      }

      let adminUser = await User.findOne({ email: FIXED_ADMIN_EMAIL, role: 'admin' });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'Agri Admin',
          email: FIXED_ADMIN_EMAIL,
          password: FIXED_ADMIN_PASSWORD,
          role: 'admin',
        });
      }

      const adminToken = signToken(adminUser);
      return res.json({
        user: { id: adminUser._id, name: adminUser.name, email: adminUser.email, phone: adminUser.phone || '', role: adminUser.role },
        token: adminToken,
      });
    }

    const user = await User.findOne({ email, ...(role ? { role } : {}) });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone || '', role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
