const express = require('express');
const { getHealth } = require('../controllers/healthController');
const authRoutes = require('./authRoutes');
const orderRoutes = require('./orderRoutes');
const chatRoutes = require('./chatRoutes');

const router = express.Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
