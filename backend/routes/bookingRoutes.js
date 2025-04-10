const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/book', authenticateToken, bookingController.bookSeats);
router.get('/', bookingController.getSeats);

module.exports = router;
