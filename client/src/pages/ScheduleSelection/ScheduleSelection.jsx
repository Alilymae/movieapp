import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingApi from "../../api/modules/booking.api";
import Container from "../../components/Container/Container";
import { routesGen } from "../../routes/routes";
import "./ScheduleSelection.css";

// SCHEDULE SELECTION
const ScheduleSelection = () => {
  const { _mediaType, mediaId } = useParams();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchSchedules();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FETCH SCHEDULES
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getSchedules({ tmdbId: mediaId });
      if (response.error) {
        setError(response.message);
      } else {
        setSchedules(response);
      }
    } catch (_err) {
      setError("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchedule = (scheduleId) => {
    navigate(routesGen.booking(scheduleId));
  };

  // DATE
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // GROUP SCHEDULES BY DATE
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const date = new Date(schedule.showDate).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(schedule);
    return acc;
  }, {});

  const uniqueDates = Object.keys(groupedSchedules).sort();

  return (
    <Container>
      <div className="schedule-selection">
        <div className="selection-header">
          <h1>Select Show Time</h1>
          <p>Choose a show time and book your tickets</p>
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading available shows...</div>
        ) : schedules.length === 0 ? (
          <div className="empty-state">
            <p>No shows available for this movie</p>
            <button onClick={() => navigate(-1)}>← Go Back</button>
          </div>
        ) : (
          <div className="schedules-container">
            <div className="dates-filter">
              {uniqueDates.map((date) => (
                <button
                  key={date}
                  className={`date-btn ${selectedDate === date ? "active" : ""}`}
                  onClick={() => setSelectedDate(selectedDate === date ? null : date)}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>

            <div className="shows-grid">
              {uniqueDates.map((date) =>
                (!selectedDate || selectedDate === date) && (
                  <div key={date} className="shows-section">
                    <h3 className="shows-date">{formatDate(date)}</h3>
                    <div className="shows-list">
                      {groupedSchedules[date].map((schedule) => (
                        <div key={schedule._id} className="show-card">
                          <div className="show-time-display">
                            <div className="time">{schedule.showTime}</div>
                            <div className="format-badge">{schedule.format}</div>
                          </div>

                          <div className="show-details">
                            <div className="detail">
                              <span className="label">Theater</span>
                              <strong>{schedule.theater.name}</strong>
                            </div>
                            <div className="detail">
                              <span className="label">Location</span>
                              <strong>{schedule.theater.location}</strong>
                            </div>
                            <div className="detail">
                              <span className="label">Language</span>
                              <strong>{schedule.language}</strong>
                            </div>
                            <div className="detail">
                              <span className="label">Available Seats</span>
                              <strong className="seats">{schedule.availableSeats}/{schedule.totalSeats}</strong>
                            </div>
                            <div className="detail">
                              <span className="label">Price</span>
                              <strong className="price">${schedule.pricePerSeat}</strong>
                            </div>
                          </div>

                          <button
                            className="btn-select"
                            onClick={() => handleSelectSchedule(schedule._id)}
                            disabled={schedule.availableSeats === 0}
                          >
                            {schedule.availableSeats === 0 ? "Sold Out" : "Select & Book"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ScheduleSelection;
