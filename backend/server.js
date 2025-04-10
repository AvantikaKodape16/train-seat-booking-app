const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Route handlers
app.use('/auth', require('./routes/auth')); // assuming auth is handled here
app.use('/book', require('./routes/bookingRoutes'));
 // ✅ only this for /book


// ✅ Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});



