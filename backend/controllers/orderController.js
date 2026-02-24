const Order = require('../models/Order');
const User = require('../models/User');

async function createOrder(req, res, next) {
  try {
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const normalizedItems = items.map((item) => {
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price || 0);

      return {
        productId: String(item.productId || ''),
        name: String(item.name || ''),
        quantity,
        price,
        subtotal: quantity * price,
      };
    });

    const invalidItem = normalizedItems.find((item) => !item.productId || !item.name || item.quantity < 1 || item.price < 0);
    if (invalidItem) {
      return res.status(400).json({ message: 'Invalid order items' });
    }

    const totalAmount = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const order = await Order.create({
      user: user._id,
      userSnapshot: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
      },
      items: normalizedItems,
      totalAmount,
      status: 'placed',
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        itemCount: order.items.length,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getAdminOrders(req, res, next) {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      totalOrders: orders.length,
      totalBuyers: new Set(orders.map((order) => String(order.user))).size,
      orders,
    });
  } catch (err) {
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      totalOrders: orders.length,
      orders,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getAdminOrders, getMyOrders };
