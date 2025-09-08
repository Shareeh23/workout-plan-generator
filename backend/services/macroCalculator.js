const MACRO_SPLITS = {
  '40-30-30': { carbs: 0.4, fat: 0.3, protein: 0.3 },
  '50-25-25': { carbs: 0.5, fat: 0.25, protein: 0.25 }, 
  '60-20-20': { carbs: 0.6, fat: 0.2, protein: 0.2 }  
};

exports.calculateMacros = (calories, split = '40-30-30') => {
  const ratios = MACRO_SPLITS[split] || MACRO_SPLITS['40-30-30'];
  
  return {
    carbs: Math.round((calories * ratios.carbs) / 4), 
    fat: Math.round((calories * ratios.fat) / 9),
    protein: Math.round((calories * ratios.protein) / 4)
  };
};

exports.getMacroSplitOptions = () => {
  return Object.keys(MACRO_SPLITS);
};
