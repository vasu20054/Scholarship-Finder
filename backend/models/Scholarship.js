const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a scholarship title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Please add a scholarship amount'],
    min: [0, 'Amount cannot be negative'],
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline date'],
  },
  cgpiCriteria: {
    type: String,
    required: [true, 'Please add CGPI criteria'],
    maxlength: [50, 'CGPI criteria cannot be more than 50 characters'],
  },
  provider: {
    type: String,
    required: [true, 'Please add a scholarship provider'],
    trim: true,
    maxlength: [100, 'Provider cannot be more than 100 characters'],
  },
  location: {
    type: String,
    required: [true, 'Please add a scholarship location'],
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters'],
  },
  specialisation: {
    type: String,
    required: [true, 'Please add a specialisation for the scholarship'],
    trim: true,
    maxlength: [100, 'Specialisation cannot be more than 100 characters'],
  },
  adminApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);