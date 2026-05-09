import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function BookingPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { expert, date, timeSlot } = state || {};

  const [form, setForm] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  // Redirect if no state passed
  if (!expert || !date || !timeSlot) {
    return (
      <div className="error-box">
        Invalid booking. Please go back and select a slot.
        <br />
        <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (!form.userName.trim()) newErrors.userName = 'Name is required';
    if (!form.userEmail.trim()) newErrors.userEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail))
      newErrors.userEmail = 'Enter a valid email';
    if (!form.userPhone.trim()) newErrors.userPhone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.userPhone))
      newErrors.userPhone = 'Enter a valid 10-digit Indian mobile number';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setApiError('');
      await API.post('/bookings', {
        expertId: id,
        ...form,
        date,
        timeSlot,
      });
      setSuccess(true);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="booking-success">
        <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <div className="success-icon"></div>
          <h2>Booking Confirmed!</h2>
          <p>Your session with <strong>{expert.name}</strong> is booked.</p>
          <div className="booking-summary">
            <div className="summary-row">
              <span>Date</span>
              <span>{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>
            <div className="summary-row">
              <span>Time</span>
              <span>{timeSlot}</span>
            </div>
            <div className="summary-row">
              <span>Expert</span>
              <span>{expert.name}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Browse More
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>
              My Bookings →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="card booking-form-card">
        <h2>Complete Your Booking</h2>

        {/* Booking Summary */}
        <div className="booking-summary">
          <div className="summary-row">
            <span>Expert</span>
            <strong>{expert.name}</strong>
          </div>
          <div className="summary-row">
            <span>Date</span>
            <strong>{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
          </div>
          <div className="summary-row">
            <span>Time</span>
            <strong>{timeSlot}</strong>
          </div>
          <div className="summary-row">
            <span>Rate</span>
            <strong>₹{expert.hourlyRate}/hr</strong>
          </div>
        </div>

        {apiError && <div className="error-box">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              name="userName"
              placeholder="Enter your full name"
              value={form.userName}
              onChange={handleChange}
            />
            {errors.userName && <p className="error-text">{errors.userName}</p>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              name="userEmail"
              type="email"
              placeholder="you@email.com"
              value={form.userEmail}
              onChange={handleChange}
            />
            {errors.userEmail && <p className="error-text">{errors.userEmail}</p>}
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              name="userPhone"
              placeholder="10-digit mobile number"
              value={form.userPhone}
              onChange={handleChange}
              maxLength={10}
            />
            {errors.userPhone && <p className="error-text">{errors.userPhone}</p>}
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              name="notes"
              placeholder="Any specific topics or questions you want to discuss..."
              value={form.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}