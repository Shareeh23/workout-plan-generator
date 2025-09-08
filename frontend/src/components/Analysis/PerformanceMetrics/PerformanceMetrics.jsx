import React from 'react';
import './PerformanceMetrics.css';

const PerformanceMetrics = ({ bestSet, averageWeight, totalVolume, history }) => {
  const metrics = [
    {
      label: 'Best Set:',
      value: bestSet?.weight 
        ? `${bestSet.weight} kg × ${bestSet.reps || 0}` 
        : 'N/A',
    },
    {
      label: 'Average Weight:',
      value: averageWeight ? `${averageWeight.toFixed(1)} kg` : 'N/A'
    },
    {
      label: 'Total Volume:',
      value: totalVolume ? `${Math.round(totalVolume)} kg` : 'N/A'
    },
    {
      label: 'Sessions Tracked:',
      value: history?.length || 0
    }
  ];

  return (
    <div className="performance-metrics-card">
      <h3 className='performance-metrics-header'>Performance Metrics</h3>
      <div className="metrics-container">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-item">
            <span className="metric-label text-lg">{metric.label}</span>
            <span className="metric-value text-lg">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
