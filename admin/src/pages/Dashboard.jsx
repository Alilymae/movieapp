import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import bookingApi from '../api/booking.api'
import './Dashboard.css'

// DASHBOARD
const Dashboard = () => {
  const [tab, setTab] = useState('schedules')
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const [formData, setFormData] = useState({
    movie: { title: '', tmdbId: 0, posterPath: '', releaseDate: '' },
    theater: { name: '', location: '', totalRows: 8, seatsPerRow: 10 },
    showDate: '',
    showTime: '',
    duration: 180,
    language: 'English',
    format: '2D',
    pricePerSeat: 10,
  })

  useEffect(() => {
    fetchSchedules()
  }, [])

  // FETCH SCHEDULES
  const fetchSchedules = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bookingApi.getSchedules()
      if (data.error) {
        setError(data.message)
      } else {
        setSchedules(data)
      }
    } catch (err) {
      setError('Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }

  // HANDLE INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: isNaN(value) ? value : Number(value) },
      })
    } else {
      setFormData({ ...formData, [name]: isNaN(value) ? value : Number(value) })
    }
  }

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await bookingApi.createSchedule(formData)
      if (response.error) {
        toast.error(response.message)
      } else {
        toast.success('Schedule created successfully!')
        setFormData({
          movie: { title: '', tmdbId: 0, posterPath: '', releaseDate: '' },
          theater: { name: '', location: '', totalRows: 8, seatsPerRow: 10 },
          showDate: '',
          showTime: '',
          duration: 180,
          language: 'English',
          format: '2D',
          pricePerSeat: 10,
        })
        setShowForm(false)
        await fetchSchedules()
      }
    } catch (err) {
      toast.error('Failed to create schedule')
    } finally {
      setLoading(false)
    }
  }

  // HANDLE DELETE
  const handleDelete = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        setDeleting(scheduleId)
        const response = await bookingApi.deleteSchedule(scheduleId)
        if (response.error) {
          toast.error(response.message)
        } else {
          toast.success('Schedule deleted successfully!')
          await fetchSchedules()
        }
      } catch (err) {
        toast.error('Failed to delete schedule')
      } finally {
        setDeleting(null)
      }
    }
  }

  // FORMAT DATE
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Imagix Dashboard</h1>
        <p>Manage movie schedules and bookings</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab ${tab === 'schedules' ? 'active' : ''}`}
          onClick={() => setTab('schedules')}
        >
          Imagix Schedules ({schedules.length})
        </button>
        <button
          className={`tab ${tab === 'bookings' ? 'active' : ''}`}
          onClick={() => setTab('bookings')}
        >
          Bookings
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {tab === 'schedules' && (
        <div className="schedules-section">
          <div className="section-header">
            <h2>Movie Schedules</h2>
            <button
              className="btn-add"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✕ Cancel' : '+ Add New Schedule'}
            </button>
          </div>

          {showForm && (
            <form className="schedule-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Movie Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Movie Title *</label>
                    <input
                      type="text"
                      name="movie.title"
                      value={formData.movie.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>TMDB ID</label>
                    <input
                      type="number"
                      name="movie.tmdbId"
                      value={formData.movie.tmdbId}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Release Date</label>
                    <input
                      type="date"
                      name="movie.releaseDate"
                      value={formData.movie.releaseDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Theater Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Theater Name *</label>
                    <input
                      type="text"
                      name="theater.name"
                      value={formData.theater.name}
                      onChange={handleInputChange}
                      placeholder="e.g., IMAX Screen 1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      name="theater.location"
                      value={formData.theater.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Downtown"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Rows</label>
                    <input
                      type="number"
                      name="theater.totalRows"
                      value={formData.theater.totalRows}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                    />
                  </div>
                  <div className="form-group">
                    <label>Seats Per Row</label>
                    <input
                      type="number"
                      name="theater.seatsPerRow"
                      value={formData.theater.seatsPerRow}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Show Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Show Date *</label>
                    <input
                      type="date"
                      name="showDate"
                      value={formData.showDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Show Time *</label>
                    <input
                      type="time"
                      name="showTime"
                      value={formData.showTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="60"
                    />
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Hindi</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Format</label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleInputChange}
                    >
                      <option>2D</option>
                      <option>3D</option>
                      <option>IMAX</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price Per Seat ($) *</label>
                    <input
                      type="number"
                      name="pricePerSeat"
                      value={formData.pricePerSeat}
                      onChange={handleInputChange}
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Schedule'}
                </button>
              </div>
            </form>
          )}

          {loading && !showForm ? (
            <div className="loading">Loading schedules...</div>
          ) : schedules.length === 0 ? (
            <div className="empty-state">
              <p>No schedules yet. Create your first schedule!</p>
            </div>
          ) : (
            <div className="schedules-grid">
              {schedules.map((schedule) => (
                <div key={schedule._id} className="schedule-card">
                  <div className="card-header">
                    <h3>{schedule.movie.title}</h3>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(schedule._id)}
                      disabled={deleting === schedule._id}
                      title="Delete schedule"
                    >
                      {deleting === schedule._id ? '⏳' : '🗑️'}
                    </button>
                  </div>

                  <div className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Theater</span>
                        <strong>{schedule.theater.name}</strong>
                      </div>
                      <div className="info-item">
                        <span className="label">Location</span>
                        <strong>{schedule.theater.location}</strong>
                      </div>
                      <div className="info-item">
                        <span className="label">Date</span>
                        <strong>{formatDate(schedule.showDate)}</strong>
                      </div>
                      <div className="info-item">
                        <span className="label">Time</span>
                        <strong>{schedule.showTime}</strong>
                      </div>
                      <div className="info-item">
                        <span className="label">Format</span>
                        <strong>{schedule.format}</strong>
                      </div>
                      <div className="info-item">
                        <span className="label">Language</span>
                        <strong>{schedule.language}</strong>
                      </div>
                      <div className="info-item">
                        <span className="label">Price</span>
                        <strong className="price">${schedule.pricePerSeat}</strong>
                      </div>
                      <div className="info-item">
                        <span className="label">Seats</span>
                        <strong className="seats">
                          {schedule.availableSeats}/{schedule.totalSeats}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div className="bookings-section">
          <h2>Bookings</h2>
          <div className="coming-soon">
            <p>Bookings analytics coming soon</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
