const Expert = require('../models/Expert');

// GET /api/experts
exports.getExperts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 6 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const total = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter)
      .select('-availableSlots')
      .skip(skip)
      .limit(Number(limit));

    res.json({
      experts,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/experts/:id
exports.getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ message: 'Expert not found' });
    res.json(expert);
  } catch (err) {
    next(err);
  }
};