const axios = require('axios');
const oneRepMaxCalculator = require('../services/oneRepMaxCalculator');
const { validationResult } = require('express-validator');

exports.generatePlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { archetype, trainingDays } = req.body;
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
    
    const trainingWeights = oneRepMaxCalculator.calculateTrainingWeights(oneRepMax);
    
    res.status(200).json({ oneRepMax, trainingWeights });
  } catch (err) {
    next(err);
  }
};
