const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },   // "2025-05-15"
  time: { type: String, required: true },   // "10:00 AM"
  isBooked: { type: Boolean, default: false },
});

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Finance', 'Health', 'Legal', 'Business', 'Education', 'Design', 'Marketing'],
  },
  experience: { type: Number, required: true },
  rating: { type: Number, min: 1, max: 5, default: 4 },
  bio: { type: String },
  hourlyRate: { type: Number, required: true },
  availableSlots: [timeSlotSchema],
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);