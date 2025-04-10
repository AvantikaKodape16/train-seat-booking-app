import React, { useState, useEffect } from 'react';
import axios from 'axios';

const totalSeats = 80;

const BookPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [seatsToBook, setSeatsToBook] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookedSeats();
  }, []);

  const fetchBookedSeats = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/book`);
      const booked = res.data
        .filter(seat => seat.is_booked)
        .map(seat => parseInt(seat.seat_number));
      setBookedSeats(booked);
    } catch (err) {
      console.error('Failed to load booked seats:', err);
    }
  };

  const resetBooking = () => {
    setSelectedSeats([]);
    setMessage('');
    setSeatsToBook('');
  };

  const autoSelectSeats = () => {
    const numSeats = parseInt(seatsToBook);
    if (isNaN(numSeats) || numSeats < 1 || numSeats > 7) {
      setMessage('❌ Enter a number between 1 and 7.');
      return;
    }

    const available = [];
    for (let i = 1; i <= totalSeats; i++) {
      if (!bookedSeats.includes(i) && !selectedSeats.includes(i)) {
        available.push(i);
      }
      if (available.length === numSeats) break;
    }

    if (available.length < numSeats) {
      setMessage('❌ Not enough available seats.');
      return;
    }

    setSelectedSeats(available);
    setMessage('');
  };

  const confirmBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/book/book`,
        { seatsToBook: selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookedSeats([...bookedSeats, ...selectedSeats]);
      setMessage(`🎉 Booked Successfully! Seats: ${selectedSeats.join(', ')}`);
      setSelectedSeats([]);
      setSeatsToBook('');
    } catch (err) {
      console.error('Booking error:', err);
      setMessage('❌ Booking failed. Some seats may already be taken.');
    }
  };

  const bookedCount = bookedSeats.length;
  const availableCount = totalSeats - bookedCount;

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-10 gap-10">
      {/* Seat Grid */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-center font-bold text-xl mb-4 text-black">Ticket Booking</h2>
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: totalSeats }, (_, i) => {
            const seatNum = i + 1;
            const isBooked = bookedSeats.includes(seatNum);
            const isSelected = selectedSeats.includes(seatNum);

            return (
              <button
                key={seatNum}
                disabled={isBooked}
                className={`w-10 h-10 rounded font-semibold text-sm
                  ${isBooked ? 'bg-red-500 text-white cursor-not-allowed'
                  : isSelected ? 'bg-blue-500 text-white'
                  : 'bg-green-500 text-white hover:scale-105 transition'}`}
              >
                {seatNum}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-6 flex justify-between text-sm">
          <div className="bg-yellow-400 px-4 py-2 rounded text-black font-medium">
            Booked Seats = {bookedCount}
          </div>
          <div className="bg-green-600 px-4 py-2 rounded text-white font-medium">
            Available Seats = {availableCount}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="bg-black rounded shadow p-6 w-80 flex flex-col gap-4 text-white">
        <label className="font-semibold text-white">Book Seats</label>
        <input
          type="number"
          value={seatsToBook}
          onChange={e => setSeatsToBook(e.target.value)}
          placeholder="Enter number of seats"
          className="border p-2 rounded text-black placeholder-white bg-gray-200"
        />
        <button
          onClick={autoSelectSeats}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Book
        </button>
        <button
          onClick={resetBooking}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Reset Booking
        </button>

        {selectedSeats.length > 0 && (
          <button
            onClick={confirmBooking}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Confirm Booking
          </button>
        )}

        {message && (
          <div className="text-sm mt-4 bg-gray-800 p-3 rounded border border-gray-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;
