function parseWorkoutResponse(response) {
  try {
    const data = typeof response === 'string' ? JSON.parse(response) : response;

    // Validate basic structure
    if (!data.sessions || !Array.isArray(data.sessions)) {
      throw new Error('Invalid workout plan structure');
    }

    // Normalize sessions
    const normalizedSessions = data.sessions.map((session, index) => ({
      sessionOrder: session.sessionOrder || index + 1,
      focusArea: session.focusArea || `Day ${index + 1}`,
      exercises: session.exercises || [],
      duration: session.duration,
      notes: session.notes,
    }));

    return {
      name: data.name || 'Generated Workout Plan',
      description: data.description || '',
      sessions: normalizedSessions,
    };
  } catch (error) {
    console.error('Error parsing workout response:', error);
    throw new Error('Failed to parse workout plan');
  }
}

module.exports = { parseWorkoutResponse };
