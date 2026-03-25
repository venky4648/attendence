const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
  },
  dailyWage: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);