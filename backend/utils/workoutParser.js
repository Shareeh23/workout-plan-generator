const mongoose = require('mongoose');

const parseWorkoutPlan = (rawResponse) => {
  try {
    let content;
    const rawContent = rawResponse.choices[0].message.content;
    
    try {
      // Try to parse the content if it's a string
      content = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
    } catch (parseError) {
      console.error('Failed to parse JSON content:');
      console.error('Raw content:', rawContent);
      console.error('Parse error:', parseError.message);
      throw new Error(`Invalid JSON in AI response: ${parseError.message}`);
    }

    return {
      planId: new mongoose.Types.ObjectId(),
      source: 'ai',
      createdAt: new Date(rawResponse.created * 1000),
      metadata: {
        requestParams: {
          planName: content.Plan_Name,
          trainingDays: content.Training_Days
        }
      },
      planName: content.Plan_Name,
      programTheme: content.Program_Theme,
      prioritizedMuscles: content.Strong_Points,
      neutralPoints: content.Neutral_Points,
      weakPoints: content.Weak_Points,
      trainingDays: content.Training_Days,
      sessions: content.Workout_Schedule.map(session => ({
        sessionOrder: parseInt(session.Workout_Day.replace(/\D/g, '')),
        focusAreas: session.Focus_Areas,
        notes: session.Notes,
        exercises: session.Exercises.map(exercise => ({
          name: exercise.Name,
          sets: exercise.Sets === '∞' ? 3 : parseInt(exercise.Sets, 10) || 3,
          repRange: exercise.Reps,
          alternates: exercise.Alternate ? exercise.Alternate.map(alt => ({
            name: alt.Name,
            sets: alt.Sets === '∞' ? 3 : parseInt(alt.Sets, 10) || 3,
            repRange: alt.Reps
          })) : []
        }))
      }))
    };
  } catch (error) {
    console.error('Error parsing workout plan:', error);
    throw new Error('Failed to parse workout plan');
  }
};

module.exports = { parseWorkoutPlan };
