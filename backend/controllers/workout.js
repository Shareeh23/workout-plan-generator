const axios = require('axios');

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
