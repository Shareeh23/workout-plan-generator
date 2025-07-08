const axios = require('axios');
const calorieCalculator = require('../services/calorieCalculator');
const macroCalculator = require('../services/macroCalculator');
const oneRepMaxCalculator = require('../services/oneRepMaxCalculator');

exports.generatePlan = async (req, res) => {
  try {
    const { archetype, trainingDays } = req.body;

    if (!archetype || !trainingDays) {
      return res
        .status(400)
        .json({ error: 'Missing archetype or trainingDays' });
    }

    // Use authenticated user's ID
    const userId = req.user._id;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model:
          'ft:gpt-4.1-2025-04-14:personal:archetype-based-workout-plan-generator:Bpl6VZ1D',
        messages: [
          {
            role: 'user',
            content: `Archetype: ${archetype}\nTraining_Days: ${trainingDays}`,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      status: 'success',
      rawResponse: response.data,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      error: 'API call failed',
      details: {
        message: error.message,
        responseData: error.response?.data,
      },
    });
  }
};

// Calorie calculation endpoint
exports.calculateCalories = async (req, res, next) => {
  try {
    const { gender, weight, height, age, activityLevel } = req.body;
    
    if (!gender || !weight || !height || !age || !activityLevel) {
      const error = new Error('Missing required parameters');
      error.statusCode = 400;
      throw error;
    }

    const calories = calorieCalculator.calculateDailyCalories(
      gender, 
      parseFloat(weight), 
      parseFloat(height), 
      parseInt(age), 
      activityLevel
    );
    
    res.status(200).json({ calories });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// Macro calculation endpoint
exports.calculateMacros = async (req, res, next) => {
  try {
    const { calories, goal } = req.body;
    
    if (!calories) {
      const error = new Error('Calories parameter is required');
      error.statusCode = 400;
      throw error;
    }

    const macros = macroCalculator.calculateMacros(parseInt(calories), goal);
    
    res.status(200).json({ macros });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// 1RM calculation endpoint
exports.calculateOneRepMax = async (req, res, next) => {
  try {
    const { weight, reps } = req.body;
    
    if (!weight || !reps) {
      const error = new Error('Weight and reps parameters are required');
      error.statusCode = 400;
      throw error;
    }

    const oneRepMax = oneRepMaxCalculator.calculateOneRepMax(
      parseFloat(weight), 
      parseInt(reps)
    );
    
    const trainingWeights = oneRepMaxCalculator.calculateTrainingWeights(oneRepMax);
    
    res.status(200).json({ oneRepMax, trainingWeights });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
