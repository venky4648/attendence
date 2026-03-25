const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
  markAttendance,
  getAttendance,
  getTodayAttendance,
  getMonthlySalary,
  getDashboard
} = require('../controllers/attendanceController.js');

router.post('/mark', auth, markAttendance);
router.get('/',  getAttendance);
router.get('/today',  getTodayAttendance);
router.get('/monthly', auth, getMonthlySalary);

// router.get('/dashboard', auth, getDashboard);

module.exports = router;