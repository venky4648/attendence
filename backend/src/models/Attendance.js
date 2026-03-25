const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Present'
  },
  checkInTime: {
    type: String
  },
  checkOutTime: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);