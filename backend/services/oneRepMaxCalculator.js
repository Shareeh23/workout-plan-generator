// Brzycki formula for 1RM calculation
exports.calculateOneRepMax = (weight, reps) => {
  if (reps === 1) return weight;
  if (reps < 1 || reps > 10) {
    throw new Error('Reps must be between 1 and 10 for accurate 1RM calculation');
  }
  return Math.round(weight * (36 / (37 - reps)));
};

// Calculate training weights for different percentages of 1RM
exports.calculateTrainingWeights = (oneRepMax) => {
  return {
    warmup: Math.round(oneRepMax * 0.5),
    endurance: Math.round(oneRepMax * 0.6),
    hypertrophy: Math.round(oneRepMax * 0.7),
    strength: Math.round(oneRepMax * 0.85),
    maxEffort: Math.round(oneRepMax * 0.95)
  };
};
