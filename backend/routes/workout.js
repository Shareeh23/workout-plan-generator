const express = require('express');

const workoutController = require('../controllers/workout.js');

const router = express.Router();

router.post('/generate', workoutController.generatePlan);

module.exports = router;
