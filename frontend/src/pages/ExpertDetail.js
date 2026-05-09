import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import API from '../utils/api';

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchExpert();
  }, [id]);

  // Real-time slot update via Socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on('slot_booked', ({ expertId, date, timeSlot }) => {
      if (expertId !== id) return;

      // Update the slot locally without refetching
      setExpert((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          availableSlots: prev.availableSlots.map((slot) =>
            slot.date === date && slot.time === timeSlot
              ? { ...slot, isBooked: true }
              : slot
          ),
        };
      });
    });

    return () => socket.off('slot_booked');
  }, [socket, id]);

  const fetchExpert = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await API.get(`/experts/${id}`);
      setExpert(data);
    } catch (err) {
      setError('Failed to load expert details.');
    } finally {
      setLoading(false);
    }
  };

  // Group slots by date
  const groupedSlots = () => {
    if (!expert) return {};
    return expert.availableSlots.reduce((acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
      return acc;
    }, {});
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short'
    });
  };

  if (loading) return <div className="loading">Loading expert profile...</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!expert) return null;

  const slots = groupedSlots();

  return (
    <div className="expert-detail">
      {/* Header */}
      <div className="card detail-header">
        <div className="detail-avatar">{expert.name.charAt(0)}</div>
        <div className="detail-info">
          <h1>{expert.name}</h1>
          <span className="expert-category">{expert.category}</span>
          <p className="expert-bio" style={{ marginTop: '0.5rem' }}>{expert.bio}</p>
          <div className="expert-meta" style={{ marginTop: '0.8rem' }}>
      <div className="meta-item">
          <div className="meta-value">{expert.rating}</div>
          <div className="meta-label">Rating</div>
       </div>
      <div className="meta-item">
         <div className="meta-value">{expert.experience} yrs</div>
         <div className="meta-label">Experience</div>
      </div>
    <div className="meta-item">
        <div className="meta-value">₹{expert.hourlyRate}</div>
        <div className="meta-label">Per Hour</div>
    </div>
</div>
        </div>
      </div>

      {/* Slots */}
      <div className="slots-section">
        <h2>Available Time Slots</h2>
        <p className="slots-subtitle">
          Slots update in real-time — select one to proceed
        </p>

        {Object.keys(slots).length === 0 ? (
          <div className="error-box">No available slots for this expert.</div>
        ) : (
          Object.entries(slots).map(([date, dateSlots]) => (
            <div key={date} className="date-group">
              <h3 className="date-label">{formatDate(date)}</h3>
              <div className="slots-grid">
                {dateSlots.map((slot) => (
                  <button
                    key={slot._id}
                    className={`slot-btn 
                      ${slot.isBooked ? 'slot-booked' : 'slot-available'}
                      ${selectedSlot?._id === slot._id ? 'slot-selected' : ''}
                    `}
                    disabled={slot.isBooked}
                    onClick={() => setSelectedSlot({ ...slot, date })}
                  >
                    {slot.time}
                    {slot.isBooked && <span className="booked-label">Booked</span>}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Proceed Button */}
      <div className="detail-actions">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button
          className="btn btn-primary"
          disabled={!selectedSlot}
          onClick={() =>
            navigate(`/booking/${expert._id}`, {
              state: {
                expert,
                date: selectedSlot.date,
                timeSlot: selectedSlot.time,
              },
            })
          }
        >
          Book Selected Slot →
        </button>
      </div>
    </div>
  );
}