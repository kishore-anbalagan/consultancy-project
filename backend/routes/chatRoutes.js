const express = require('express');
const { askQuestion, getHistory } = require('../controllers/chatController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.use(optionalAuth);
router.post('/ask', askQuestion);
router.get('/history', getHistory);

module.exports = router;