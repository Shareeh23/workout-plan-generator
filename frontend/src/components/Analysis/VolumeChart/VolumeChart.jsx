import React from 'react';
import { format } from 'date-fns';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import './VolumeChart.css';

const VolumeChart = ({ data, volumeAverage }) => {
  if (!data || data.length === 0) {
    return <div className="no-data-message">No volume data available</div>;
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer >
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'MMM d')}
          />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right"/>
          <Tooltip 
            labelFormatter={(date) => format(new Date(date), 'PPP')}
            formatter={(value, name) => {
              if (name === 'Volume') return [`${value} kg`, name];
              return [value, name];
            }}
          />
          <Legend />
          <Bar 
            yAxisId="left" 
            dataKey="volume" 
            name="Volume (kg)" 
            barSize={20}
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="reps" 
            name="Total Reps" 
            stroke="var(--lime-green)"
            strokeWidth={3}
          />
          {volumeAverage > 0 && (
            <ReferenceLine 
              yAxisId="left"
              y={volumeAverage}
              label={{ 
                value: `Avg: ${volumeAverage.toFixed(1)}kg`, 
                position: 'insideTopRight',
              }}
              strokeDasharray="3 3"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;
