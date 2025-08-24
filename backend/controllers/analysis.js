const getExerciseHistory = require("../services/progressAnalyzer");

function calculateProgress(history) {
  if (history.length < 2) return null;
  
  const first = history[0];
  const latest = history[history.length - 1];
  const weeks = (latest.date - first.date) / (7 * 24 * 60 * 60 * 1000);
  
  return {
    weight: {
      current: latest.weight,
      change: latest.weight - first.weight,
      weeklyChange: (latest.weight - first.weight) / weeks
    },
    volume: {
      current: latest.volume,
      change: latest.volume - first.volume,
      weeklyChange: (latest.volume - first.volume) / weeks
    }
  };
}

function analyzeTrend(history, metric) {
  if (history.length < 3) return 'insufficient data';
  
  // 1. Calculate the slope (existing code)
  const points = history.map((h, i) => ({ x: i, y: h[metric] }));
  const n = points.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  points.forEach(p => {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
  });
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // 2. Calculate R-squared (goodness of fit)
  const yMean = sumY / n;
  let ssTot = 0;
  let ssRes = 0;
  
  points.forEach(p => {
    const yPred = slope * p.x + (sumY - slope * sumX) / n;
    ssTot += Math.pow(p.y - yMean, 2);
    ssRes += Math.pow(p.y - yPred, 2);
  });
  
  const rSquared = 1 - (ssRes / ssTot);
  
  // 3. Determine trend confidence
  let confidence = 'low';
  if (Math.abs(slope) > 0.1) {  // Adjust threshold as needed
    if (rSquared > 0.5) confidence = 'high';
    else if (rSquared > 0.3) confidence = 'medium';
  }
  
  // 4. Check for volatility (standard deviation of residuals)
  const residuals = points.map(p => {
    const yPred = slope * p.x + (sumY - slope * sumX) / n;
    return p.y - yPred;
  });
  
  const residualStdDev = Math.sqrt(
    residuals.reduce((sum, r) => sum + r * r, 0) / n
  );
  
  const isVolatile = residualStdDev > (yMean * 0.1); // 10% of mean as threshold
  
  return {
    slope,
    rSquared,  // 0-1, where 1 is perfect fit
    confidence,
    isVolatile,
    direction: 
      Math.abs(slope) < 0.01 ? 'stable' : 
      slope > 0 ? 'up' : 'down'
  };
}

const getAnalysis = async (req, res, next) => {
  try {
    const history = await getExerciseHistory(req.user._id, req.params.exercise);
    if (!history.length) return res.status(404).json({ error: 'No data' });
    
    const metrics = calculateProgress(history);
    const weightTrend = analyzeTrend(history, 'weight');
    const volumeTrend = analyzeTrend(history, 'volume');
    
    res.json({
      metrics,
      trends: { weight: weightTrend, volume: volumeTrend },
      history: history.map(item => ({
        date: item.date,
        weight: item.weight,
        volume: item.volume,
        reps: item.reps
      }))
    });
  } catch (error) {
    next(error)
  }
}

module.exports = { getAnalysis };