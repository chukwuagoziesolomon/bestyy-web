import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

interface SparklineProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ data, color = '#10b981', height = 36 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      <Line
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={2}
        dot={false}
        activeDot={false}
        isAnimationActive={false}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default Sparkline; 