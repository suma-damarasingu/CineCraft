const express = require('express');
const { getScriptBreakdown, optimizeSchedule } = require('../controllers/scheduleController');

const router = express.Router();

router.get('/:id/schedule', getScriptBreakdown);
router.post('/:id/schedule/optimize', optimizeSchedule);

module.exports = router;
