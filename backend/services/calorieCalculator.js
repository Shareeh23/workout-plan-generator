// Harris-Benedict equation for BMR calculation
const calculateBMR = (gender, weight, height, age) => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

exports.calculateDailyCalories = (gender, weight, height, age, activityLevel) => {
  const ACTIVITY_FACTORS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };
  
  const bmr = calculateBMR(gender, weight, height, age);
  return Math.round(bmr * ACTIVITY_FACTORS[activityLevel]);
};
