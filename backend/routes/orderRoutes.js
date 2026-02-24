const express = require('express');
const { createOrder, getAdminOrders, getMyOrders } = require('../controllers/orderController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, createOrder);
router.get('/my', requireAuth, getMyOrders);
router.get('/admin', requireAuth, requireAdmin, getAdminOrders);

module.exports = router;
