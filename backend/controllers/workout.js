const axios = require('axios');
const User = require('../models/user');
const { parseWorkoutResponse } = require('../utils/workoutParser');

exports.generatePlan = async (req, res, next) => {
  try {
    const { userId, prioritizedMuscles, trainingDays } = req.body;

    // Validate input
    if (!userId) return res.status(400).json({ error: 'User ID is required' });
    if (!Array.isArray(prioritizedMuscles) || prioritizedMuscles.length === 0) {
      return res
        .status(400)
        .json({ error: 'Prioritized muscles must be a non-empty array' });
    }
    if (
      typeof trainingDays !== 'number' ||
      trainingDays < 3 ||
      trainingDays > 6
    ) {
      return res
        .status(400)
        .json({ error: 'Training days must be between 3 and 6' });
    }

    // Check user exists
    const user = await User.findOne({
      $or: [{ _id: userId }, { googleId: userId }],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Construct prompt for Ollama
    const prompt = {
      model: 'NatHype-LM', 
      prompt: `Generate a ${trainingDays}-day plan focusing on ${prioritizedMuscles.join(
        ', '
      )}`,
      format: 'json',
      stream: false,
    };

    // Call Ollama API
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      prompt
    );
    const generatedPlan = response.data.response;

    // Parse and validate the response
    const workoutPlan = {
      source: 'ai',
      prioritizedMuscles,
      trainingDaysPerWeek: trainingDays,
      ...JSON.parse(generatedPlan),
    };

    // Archive current plan if exists
    if (user.workoutPlan) {
      user.workoutHistory.push({
        plan: user.workoutPlan,
        completedAt: new Date(),
      });
    }

    // Save new plan
    user.workoutPlan = workoutPlan;
    await user.save();

    res.json({
      plan: workoutPlan,
      message: 'Workout plan generated successfully',
    });
  } catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({ error: 'Failed to generate workout plan' });
  }
};
