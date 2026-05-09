const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

// POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { expertId, userName, userEmail, userPhone, date, timeSlot, notes } = req.body;

    const expert = await Expert.findById(expertId);
    if (!expert) return res.status(404).json({ message: 'Expert not found' });

    // Check slot exists and is not booked
    const slot = expert.availableSlots.find(
      (s) => s.date === date && s.time === timeSlot
    );
    if (!slot) return res.status(400).json({ message: 'Slot not found' });
    if (slot.isBooked) return res.status(409).json({ message: 'Slot already booked' });

    // Mark slot as booked atomically
    const updated = await Expert.findOneAndUpdate(
      {
        _id: expertId,
        'availableSlots.date': date,
        'availableSlots.time': timeSlot,
        'availableSlots.isBooked': false,  // ← race condition guard
      },
      { $set: { 'availableSlots.$.isBooked': true } },
      { new: true }
    );

    if (!updated) {
      return res.status(409).json({ message: 'Slot was just booked by someone else. Please choose another.' });
    }

    // Create booking
    const booking = await Booking.create({
      expertId,
      expertName: expert.name,
      userName,
      userEmail,
      userPhone,
      date,
      timeSlot,
      notes,
    });

    // Emit real-time event to all connected clients
    const io = req.app.get('io');
    io.emit('slot_booked', { expertId, date, timeSlot });

    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (err) {
    // Unique index violation = double booking attempt
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This slot was already booked. Please choose another.' });
    }
    next(err);
  }
};

// GET /api/bookings?email=
exports.getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const bookings = await Booking.find({ userEmail: email.toLowerCase() }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/bookings/:id/status
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json(booking);
  } catch (err) {
    next(err);
  }
};