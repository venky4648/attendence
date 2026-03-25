const express = require('express');
const router = express.Router();
const { addWorker, getWorkers } = require('../controllers/workerController');

router.post('/add', addWorker);
router.get('/', getWorkers);

module.exports = router;