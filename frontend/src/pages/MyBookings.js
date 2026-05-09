import { useState } from 'react';
import API from '../utils/api';

export default function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchBookings = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError('');
      const { data } = await API.get(`/bookings?email=${email.trim()}`);
      setBookings(data);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const formatCreated = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="my-bookings">
      <div className="my-bookings-header">
        <h1>My Bookings</h1>
        <p>Enter your email to view all your sessions</p>
      </div>

      {/* Email Search */}
      <form onSubmit={fetchBookings} className="email-search-form card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Email Address</label>
          <div className="email-search-row">
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="error-box">{error}</div>}

      {/* Results */}
      {searched && !loading && (
        <>
          {bookings.length === 0 ? (
            <div className="no-bookings card">
              <div style={{ fontSize: '2.5rem' }}>📭</div>
              <h3>No bookings found</h3>
              <p>We couldn't find any bookings for <strong>{email}</strong></p>
            </div>
          ) : (
            <>
              <p className="bookings-count">
                Found <strong>{bookings.length}</strong> booking{bookings.length > 1 ? 's' : ''}
              </p>
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking._id} className="card booking-card">
                    <div className="booking-card-header">
                      <div>
                        <h3>{booking.expertName}</h3>
                        <p className="booking-created">Booked on: {formatCreated(booking.createdAt)}</p>
                      </div>
                      <span className={`badge badge-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="booking-card-body">
                      <div className="booking-detail-row">
                        <span>Date: </span>
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="booking-detail-row">
                        <span>Time: </span>
                        <span>{booking.timeSlot}</span>
                      </div>
                      <div className="booking-detail-row">
                        <span>Name: </span>
                        <span>{booking.userName}</span>
                      </div>
                      <div className="booking-detail-row">
                        <span>Phone: </span>
                        <span>{booking.userPhone}</span>
                      </div>
                      {booking.notes && (
                        <div className="booking-detail-row">
                          <span>Notes: </span>
                          <span>{booking.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}