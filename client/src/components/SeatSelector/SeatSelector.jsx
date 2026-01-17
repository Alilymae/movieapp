import { useState, useEffect } from "react";
import "./SeatSelector.css";

// SEAT SELECTOR
const SeatSelector = ({ schedule, seatAvailability, onSeatsSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const theater = schedule.theater;
  const totalRows = theater.totalRows || 8;
  const seatsPerRow = theater.seatsPerRow || 10;

  const seats = seatAvailability?.seats || [];

  // HANDLE SEAT CLICK
  const handleSeatClick = (seatId) => {
    const seatData = seats.find((s) => s.seatId === seatId);

    if (seatData?.isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  // SYNC SELECTED SEATS
  useEffect(() => {
    onSeatsSelect(selectedSeats);
  }, [selectedSeats, onSeatsSelect]);

  // GET SEAT STATUS
  const getSeatStatus = (seatId) => {
    const seat = seats.find((s) => s.seatId === seatId);
    if (seat?.isBooked) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  return (
    <div className="seat-selector">
      <div className="seat-selector-header">
        <h3>
          {theater.name} - {theater.location}
        </h3>
        <p className="screen-label">SCREEN</p>
      </div>

      <div className="seats-grid">
        {Array.from({ length: totalRows }).map((_, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            <span className="row-label">
              {String.fromCharCode(65 + rowIndex)}
            </span>
            <div className="seats-in-row">
              {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
                const seatId = `${String.fromCharCode(65 + rowIndex)}${
                  seatIndex + 1
                }`;
                const status = getSeatStatus(seatId);

                return (
                  <button
                    key={seatId}
                    className={`seat seat-${status}`}
                    onClick={() => handleSeatClick(seatId)}
                    disabled={status === "booked"}
                    title={seatId}
                  >
                    {seatIndex + 1}
                  </button>
                );
              })}
            </div>
            <span className="row-label">
              {String.fromCharCode(65 + rowIndex)}
            </span>
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-sample seat-available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat-sample seat-selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat-sample seat-booked"></div>
          <span>Booked</span>
        </div>
      </div>

      <div className="seat-selector-info">
        <div className="info-item">
          <span>Selected Seats:</span>
          <strong>
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
          </strong>
        </div>
        <div className="info-item">
          <span>Total Price:</span>
          <strong>${selectedSeats.length * schedule.pricePerSeat}</strong>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
