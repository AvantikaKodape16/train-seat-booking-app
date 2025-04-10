const pool = require('../db'); // ✅ ADD THIS

exports.bookSeats = async (req, res) => {
  const { seatsToBook } = req.body;

  if (!Array.isArray(seatsToBook)) {
    return res.status(400).send("Invalid seat data");
  }

  const userId = req.user.userId;

  if (seatsToBook.length > 7) {
    return res.status(400).send('Max 7 seats allowed');
  }

  const placeholders = seatsToBook.map((_, i) => `$${i + 1}`).join(',');

  try {
    const available = await pool.query(
      `SELECT seat_number FROM seats WHERE seat_number IN (${placeholders}) AND is_booked = false`,
      seatsToBook
    );

    if (available.rows.length !== seatsToBook.length) {
      return res.status(400).send('Some seats already booked');
    }

    for (const seat of seatsToBook) {
      await pool.query(
        'UPDATE seats SET is_booked = true, user_id = $1 WHERE seat_number = $2',
        [userId, seat]
      );
    }

    res.send('Booking successful');
  } catch (error) {
    console.error('Error booking seats:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getSeats = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM seats ORDER BY seat_number');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching seats:', err);
    res.status(500).send('Internal Server Error');
  }
};
