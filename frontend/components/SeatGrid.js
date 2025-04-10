// frontend/components/SeatGrid.js

import React, { useState } from "react";

const totalSeats = 80;

export default function SeatGrid() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((n) => n !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Ticket Booking</h1>

      {/* Seat Grid */}
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: totalSeats }, (_, i) => {
          const seatNum = i + 1;
          const isSelected = selectedSeats.includes(seatNum);
          return (
            <button
              key={seatNum}
              onClick={() => toggleSeat(seatNum)}
              className={`w-10 h-10 rounded-md font-medium text-white text-sm ${
                isSelected ? "bg-yellow-400" : "bg-green-600"
              } hover:scale-105 transition-transform`}
            >
              {seatNum}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex gap-6">
        <span className="bg-yellow-300 text-black px-4 py-1 rounded">
          Booked Seats = {selectedSeats.length}
        </span>
        <span className="bg-green-600 text-white px-4 py-1 rounded">
          Available Seats = {totalSeats - selectedSeats.length}
        </span>
      </div>
    </div>
  );
}
