const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

async function verifyGoogleIdToken(idToken) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(payload?.error_description || payload?.error || 'Invalid Google token');
    err.status = 401;
    throw err;
  }

  return payload;
}

async function googleLogin(req, res, next) {
  try {
    const credential = String(req.body?.credential || '').trim();
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const googleClientId = String(process.env.GOOGLE_CLIENT_ID || '').trim();
    const hasGoogleClientId = googleClientId && !googleClientId.includes('your-google-web-client-id.apps.googleusercontent.com');
    if (!hasGoogleClientId) {
      return res.status(503).json({ message: 'Google sign-in is not configured. Set GOOGLE_CLIENT_ID in backend/.env.' });
    }

    const googleUser = await verifyGoogleIdToken(credential);
    if (googleUser.aud !== googleClientId) {
      return res.status(401).json({ message: 'Google token audience mismatch' });
    }

    if (!googleUser.email || googleUser.email_verified !== 'true') {
      return res.status(401).json({ message: 'Google account email is not verified' });
    }

    const email = String(googleUser.email).toLowerCase();
    let user = await User.findOne({ email });

    if (user && user.role === 'admin') {
      return res.status(403).json({ message: 'Admin cannot sign in with Google' });
    }

    if (!user) {
      const fallbackName = email.split('@')[0] || 'Farmer';
      user = await User.create({
        name: googleUser.name || fallbackName,
        email,
        phone: '',
        password: crypto.randomBytes(24).toString('hex'),
        role: 'user',
      });
    }

    const token = signToken(user);
    return res.json({
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone || '', role: user.role },
      token,
    });
  } catch (err) {
    if (err?.status) {
      return res.status(err.status).json({ message: err.message || 'Google sign-in failed' });
    }
    return next(err);
  }
}

module.exports = { signup, login, googleLogin };
