const express = require('express');
const { createAppointment, getAdminAppointments } = require('../controllers/appointmentController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, createAppointment);
router.get('/admin', requireAuth, requireAdmin, getAdminAppointments);

module.exports = router;
