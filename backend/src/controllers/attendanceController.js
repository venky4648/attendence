const Attendance = require('../models/Attendance');
const Worker = require('../models/Worker');
exports.markAttendance = async (req, res) => {
  try {
    const { workerId, status, checkInTime } = req.body;

    // 🧠 Get today's start and end
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 🔍 Check if already marked today
    const existing = await Attendance.findOne({
      workerId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existing) {
      return res.status(400).json({
        message: 'Attendance already marked for today'
      });
    }

    // ✅ Create attendance
    const attendance = new Attendance({
      workerId,
      status,
      checkInTime,
      date: new Date()
    });

    await attendance.save();

    res.status(201).json(attendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find().populate('workerId');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const data = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    }).populate('workerId');

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMonthlySalary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const data = await Attendance.find({
      date: { $gte: startDate, $lt: endDate },
      status: 'Present'
    }).populate('workerId');

    const salaryMap = {};

    data.forEach(item => {
      const worker = item.workerId;

      if (!salaryMap[worker._id]) {
        salaryMap[worker._id] = {
          name: worker.name,
          days: 0,
          totalSalary: 0
        };
      }

      salaryMap[worker._id].days += 1;
      salaryMap[worker._id].totalSalary += worker.dailyWage;
    });

    res.json(Object.values(salaryMap));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();

    // ✅ Correct way (NO mutation)
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const totalWorkers = await Worker.countDocuments();

    const presentToday = await Attendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'Present'
    });

    const absentToday = totalWorkers - presentToday;

    // ✅ Month calculation
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const attendance = await Attendance.find({
      date: { $gte: startOfMonth },
      status: 'Present'
    }).populate('workerId');

    let totalSalary = 0;

    attendance.forEach(item => {
      if (item.workerId) {
        totalSalary += item.workerId.dailyWage;
      }
    });

    console.log({
      totalWorkers,
      presentToday,
      absentToday,
      totalSalary
    });

    res.json({
      totalWorkers,
      presentToday,
      absentToday,
      totalSalary
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};