const express = require('express');
const router = express.Router();

let bookedSeats = [];

router.post('/', (req, res) => {
  const { seats } = req.body;

  // Check for already booked
  const alreadyBooked = seats.some(seat => bookedSeats.includes(seat));
  if (alreadyBooked) {
    return res.status(400).json({ message: 'One or more seats already booked' });
  }

  // Book the seats
  bookedSeats.push(...seats);

  res.status(200).json({ message: 'Seats booked successfully', bookedSeats });
});

module.exports = router;