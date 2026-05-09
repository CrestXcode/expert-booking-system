const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  expertName: { type: String, required: true },
  userName: { type: String, required: true, trim: true },
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  userPhone: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed'],
    default: 'Pending',
  },
}, { timestamps: true });

// This index is KEY — prevents double booking at DB level
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);