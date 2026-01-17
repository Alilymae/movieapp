import { useState, useEffect } from "react";
import "./BookingConfirmation.css";

// BOOKING CONFIRMATION
const BookingConfirmation = ({ booking, schedule, onDownload, onDone }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // COPY TO CLIPBOARD
  const copyToClipboard = () => {
    navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
  };
// FORMAT DATE
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="booking-confirmation">
      <div className="confirmation-card">
        <div className="confirmation-header success">
          <div className="success-icon">SUCCESS</div>
          <h2>Booking Confirmed!</h2>
          <p>Your Imagix tickets have been booked successfully</p>
        </div>

        <div className="booking-details-section">
          <h3>Booking Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Booking Reference</span>
              <div className="reference-box">
                <strong>{booking.bookingReference}</strong>
                <button
                  className="copy-btn"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="detail-item">
              <span className="label">Movie</span>
              <strong>{schedule.movie.title}</strong>
            </div>

            <div className="detail-item">
              <span className="label">Theater</span>
              <strong>{schedule.theater.name}</strong>
            </div>

            <div className="detail-item">
              <span className="label">Location</span>
              <strong>{schedule.theater.location}</strong>
            </div>

            <div className="detail-item">
              <span className="label">Date</span>
              <strong>{formatDate(schedule.showDate)}</strong>
            </div>

            <div className="detail-item">
              <span className="label">Show Time</span>
              <strong>{schedule.showTime}</strong>
            </div>

            <div className="detail-item">
              <span className="label">Format</span>
              <strong>{schedule.format}</strong>
            </div>

            <div className="detail-item">
              <span className="label">Language</span>
              <strong>{schedule.language}</strong>
            </div>
          </div>
        </div>

        <div className="seats-section">
          <h3>Your Seats</h3>
          <div className="seats-display">
            {booking.seats.map((seat, index) => (
              <div key={index} className="seat-badge">
                {seat.seatLetter}
                {seat.seatNumber}
              </div>
            ))}
          </div>
        </div>

        <div className="price-section">
          <h3>Price Breakdown</h3>
          <div className="price-item">
            <span>Number of Seats:</span>
            <strong>{booking.seats.length}</strong>
          </div>
          <div className="price-item">
            <span>Price per Seat:</span>
            <strong>${schedule.pricePerSeat}</strong>
          </div>
          <div className="price-item total">
            <span>Total Amount Paid:</span>
            <strong>${booking.totalPrice.toFixed(2)}</strong>
          </div>
        </div>

        <div className="important-notice">
          <h4> Information</h4>
          <ul>
            <li>Please arrive 15 minutes before the show time</li>
            <li>Valid ID proof may be required at the entrance</li>
            <li>Save your booking reference for check-in</li>
            <li>Your e-ticket has been sent to your registered email</li>
          </ul>
        </div>

        <div className="confirmation-actions">
          <button className="btn-download" onClick={onDownload}>
            Download Ticket
          </button>
          <button className="btn-done" onClick={onDone}>
            Back to Home
          </button>
        </div>
      </div>

      <div className="confirmation-qr">
        <div className="qr-container">
          <div className="qr-placeholder">
            <div className="qr-pattern">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className="qr-dot"
                  style={{
                    opacity: Math.random() > 0.3 ? 1 : 0.2,
                  }}
                ></div>
              ))}
            </div>
          </div>
          <p>Scan for booking details</p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
// PAIN IN THE ASS TO FORMAT