const axios = require('axios');
const User = require('../models/user');
const { parseWorkoutPlan } = require('../utils/workoutParser');
const oneRepMaxCalculator = require('../services/oneRepMaxCalculator');
const { validationResult } = require('express-validator');
const { WorkoutGenerationError } = require('../utils/errors');

const systemPrompt = `
You are a knowledgeable personal trainer who generates training plans inspired by fictional character physiques and Natural Hypertrophy's style.

Given a fictional character name and number of training days, infer prioritized muscle groups and return a complete workout plan in this JSON format:

{
  "Plan_Name": "<Plan Name>",
  "Training_Days": <Number of Training Days>,
  "Program_Theme": "<Fictional Character or Theme>",
  "Strong_Points": ["<Muscle Group>", "<Muscle Group>", "..."],
  "Neutral_Points": ["<Muscle Group>", "<Muscle Group>", "..."],
  "Weak_Points": ["<Muscle Group>", "<Muscle Group>", "..."],
  "Workout_Schedule": [
    {
      "Workout_Day": "<Day Label>",
      "Focus_Areas": ["<Muscle Group>", "<Muscle Group>", "..."],
      "Exercises": [
        {
          "Name": "<Exercise Name>",
          "Sets": <Number of Sets>,
          "Reps": "<Rep Range or Duration>",
          "Alternate": [
            {
              "Name": "<Alternate Exercise Name>",
              "Sets": <Number of Sets>,
              "Reps": "<Rep Range or Duration>"
            }
          ]
        }
      ],
      "Notes": "<Detailed explanatory notes for the day's workout>"
    }
  ]
}

Avoid supersets. All muscle groups must receive at least maintenance volume. Use Natural Hypertrophy's voice and volume philosophy. Ensure exercises, reps, and notes follow this structure precisely. Only include the "Alternate" field when actual alternate exercises are present. If there are no alternates, omit the "Alternate" key entirely.
`.trim();

const generateWorkoutFromAI = async (archetype, trainingDays) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'ft:gpt-4.1-2025-04-14:personal:workout-plan-generator-v2:BrQ7lkRi',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: JSON.stringify({
              Archetype: archetype,
              Training_Days: trainingDays
            })
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new WorkoutGenerationError('Failed to generate workout from AI', {
      originalError: error,
      requestData: { archetype, trainingDays }
    });
  }
};

exports.generatePlan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { archetype, trainingDays } = req.body;
    const aiResponse = await generateWorkoutFromAI(archetype, trainingDays);
    const workoutPlan = parseWorkoutPlan(aiResponse);
    
    const user = await User.findById(req.user._id);
    user.workoutPlan = workoutPlan;
    
    if (user.workoutHistory) {
      user.workoutHistory.push({
        planRef: workoutPlan._id,
        planName: workoutPlan.planName,
        createdAt: workoutPlan.createdAt,
        completedAt: null,
        programTheme: workoutPlan.programTheme
      });
    }
    
    await user.save();
    res.json({ status: 'success', workoutPlan });
  } catch (error) {
    next(error);
  }
};

// 1RM calculation endpoint
exports.calculateOneRepMax = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { weight, reps } = req.body;
    const oneRepMax = oneRepMaxCalculator.calculateOneRepMax(
      parseFloat(weight),
      parseInt(reps)
    );

    const trainingWeights =
      oneRepMaxCalculator.calculateTrainingWeights(oneRepMax);

    res.status(200).json({ oneRepMax, trainingWeights });
  } catch (err) {
    next(err);
  }
};
