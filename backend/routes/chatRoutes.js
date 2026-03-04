const express = require('express');
const { askQuestion, getHistory } = require('../controllers/chatController');
const { optionalAuth, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(optionalAuth);
router.post('/ask', askQuestion);
router.get('/history', requireAuth, getHistory);

module.exports = router;