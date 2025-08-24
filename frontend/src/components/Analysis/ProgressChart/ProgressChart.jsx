import React from 'react';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import './ProgressChart.css';

const ProgressChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <h3 className="no-data-message">No weight data available</h3>;
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width="100%" height="100%" margin={{ top: 0, right: 0, bottom: 0, left: 0 }} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'MMM d')}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(date) => format(new Date(date), 'PPP')}
            formatter={(value) => [`${value} kg`, 'Weight']}
          />
          <Legend align='center' />
          <Line 
            type="monotone" 
            dataKey="weight" 
            name="Weight (kg)" 
            stroke="var(--tangerine-100)"
            strokeWidth={3}
            dot={true}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
