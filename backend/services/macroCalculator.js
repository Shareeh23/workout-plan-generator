exports.calculateMacros = (calories, goal = 'maintenance') => {
  const GOAL_RATIOS = {
    maintenance: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    muscleGain: { protein: 0.35, carbs: 0.45, fat: 0.2 },
    fatLoss: { protein: 0.4, carbs: 0.35, fat: 0.25 }
  };
  
  const ratios = GOAL_RATIOS[goal] || GOAL_RATIOS.maintenance;
  
  return {
    protein: Math.round((calories * ratios.protein) / 4), // 4 cal/g
    carbs: Math.round((calories * ratios.carbs) / 4),    // 4 cal/g
    fat: Math.round((calories * ratios.fat) / 9)         // 9 cal/g
  };
};
