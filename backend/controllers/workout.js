const axios = require('axios');
const User = require('../models/user');
const { parseWorkoutPlan } = require('../utils/workoutParser');
const oneRepMaxCalculator = require('../services/oneRepMaxCalculator');
const { validationResult } = require('express-validator');
const { WorkoutGenerationError } = require('../utils/errors');
const WorkoutLog = require('../models/workoutLogSchema');

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
        model:
          'ft:gpt-4.1-2025-04-14:personal:workout-plan-generator-v2:BrQ7lkRi',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: JSON.stringify({
              Archetype: archetype,
              Training_Days: trainingDays,
            }),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new WorkoutGenerationError('Failed to generate workout from AI', {
      originalError: error,
      requestData: { archetype, trainingDays },
    });
  }
};

exports.generateWorkoutPlan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user._id);

    // Check for active plan
    if (user.workoutPlan?.isActive) {
      return res.status(400).json({
        status: 'error',
        code: 'ACTIVE_PLAN_EXISTS',
        message: 'You already have an active workout plan',
        action: 'Complete or deactivate current plan first',
      });
    }

    const { archetype, trainingDays } = req.body;
    const aiResponse = await generateWorkoutFromAI(archetype, trainingDays);
    const workoutPlan = parseWorkoutPlan(aiResponse);

    // Set plan as active
    user.workoutPlan = { ...workoutPlan, isActive: true };

    if (user.workoutHistory) {
      user.workoutHistory.push({
        planRef: workoutPlan._id,
        planName: workoutPlan.planName,
        createdAt: workoutPlan.createdAt,
        completedAt: null,
        programTheme: workoutPlan.programTheme,
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

exports.deactivatePlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.workoutPlan) {
      return res.status(400).json({
        status: 'error',
        code: 'NO_ACTIVE_PLAN',
        message: 'No workout plan to deactivate',
      });
    }

    // Update history entry before clearing plan
    if (user.workoutHistory) {
      const activePlanIndex = user.workoutHistory.findIndex((entry) =>
        entry.planRef.equals(user.workoutPlan._id)
      );

      if (activePlanIndex !== -1) {
        user.workoutHistory[activePlanIndex].completedAt = new Date();
      }
    }

    user.workoutPlan = undefined; // Remove the entire plan
    await user.save();

    res.json({
      status: 'success',
      suggestedAction: {
        type: 'redirect',
        path: '/generate',
      },
      message: 'Workout plan deactivated',
    });
  } catch (error) {
    next(error);
  }
};

exports.logWorkout = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const { sessionOrder, exercises } = req.body;
    const userId = req.userId;

    const workoutLog = new WorkoutLog({
      user: userId,
      sessionOrder,
      exercises,
    });

    await workoutLog.save();

    res.status(201).json({
      message: 'Workout logged successfully',
      logId: workoutLog._id,
    });
  } catch (err) {
    next(err);
  }
};

exports.createLog = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array(),
      });
    }

    const log = await WorkoutLog.create({
      userId: req.user._id,
      ...req.body,
    });
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await WorkoutLog.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(logs);
  } catch (error) {
    next(error);
  } 
};

exports.updateLog = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array(),
      });
    }

    const log = await WorkoutLog.findOneAndUpdate(
      { _id: req.params.logId, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!log) throw new Error('Log not found');
    res.json(log);
  } catch (error) {
    next(error);
  }
};

exports.getPlannedExercises = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.workoutPlan) {
      return res.status(404).json({
        status: 'error',
        message: 'No active workout plan found',
      });
    }

    const session = user.workoutPlan.trainingDays.find(
      (day) => day.order === Number(req.query.sessionOrder)
    );

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found in plan',
      });
    }

    res.json({
      status: 'success',
      exercises: session.exercises,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMuscleGroupPriorities = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.workoutPlan) {
      return res.status(404).json({
        status: 'error',
        code: 'NO_ACTIVE_PLAN',
        message: 'No active workout plan found',
      });
    }

    res.json({
      status: 'success',
      data: {
        strongPoints: user.workoutPlan.strongPoints,
        neutralPoints: user.workoutPlan.neutralPoints,
        weakPoints: user.workoutPlan.weakPoints,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getWorkoutPlanSummary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.workoutPlan) {
      return res.status(404).json({
        status: 'error',
        code: 'NO_ACTIVE_PLAN',
        message: 'No active workout plan found',
      });
    }

    res.json({
      status: 'success',
      data: {
        planName: user.workoutPlan.planName,
        programTheme: user.workoutPlan.programTheme,
        trainingDays: user.workoutPlan.trainingDays.length,
        createdAt: user.workoutPlan.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getFullWorkoutPlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.workoutPlan) {
      return res.status(404).json({
        status: 'error',
        code: 'NO_ACTIVE_PLAN',
        message: 'No active workout plan found',
      });
    }

    res.json({
      status: 'success',
      data: user.workoutPlan,
    });
  } catch (error) {
    next(error);
  }
};

exports.getWorkoutSession = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.workoutPlan) {
      return res.status(404).json({
        status: 'error',
        code: 'NO_ACTIVE_PLAN',
        message: 'No active workout plan found',
      });
    }

    const session = user.workoutPlan.trainingDays.find(
      (day) => day.order === Number(req.params.sessionOrder)
    );

    if (!session) {
      return res.status(404).json({
        status: 'error',
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found in plan',
      });
    }

    res.json({
      status: 'success',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

exports.getWorkoutHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.workoutHistory || []);
  } catch (error) {
    next(error);
  }
};