const mongoose = require('mongoose');

const parseWorkoutPlan = (rawResponse) => {
  try {
    // Extract the content from OpenAI response
    const content = typeof rawResponse.choices[0].message.content === 'string' 
      ? JSON.parse(rawResponse.choices[0].message.content)
      : rawResponse.choices[0].message.content;

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
          sets: exercise.Sets,
          repRange: exercise.Reps
        }))
      }))
    };
  } catch (error) {
    console.error('Error parsing workout plan:', error);
    throw new Error('Failed to parse workout plan');
  }
};

module.exports = { parseWorkoutPlan };
