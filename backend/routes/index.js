const express = require('express');
const { getHealth } = require('../controllers/healthController');
const authRoutes = require('./authRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
