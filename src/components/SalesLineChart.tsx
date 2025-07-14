import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// Define the type for a data point
interface DataPoint {
  name: string;
  value: number;
}

interface SalesLineChartProps {
  data?: DataPoint[];
  label?: string;
  height?: number;
  months?: string[];
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
}

const defaultData: DataPoint[] = [
  { name: '5k', value: 20 },
  { name: '10k', value: 45 },
  { name: '15k', value: 50 },
  { name: '20k', value: 64.3664 },
  { name: '25k', value: 45 },
  { name: '30k', value: 60 },
  { name: '35k', value: 20 },
  { name: '40k', value: 35 },
  { name: '45k', value: 75 },
  { name: '50k', value: 55 },
  { name: '55k', value: 55 },
  { name: '60k', value: 60 }
];

const defaultMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getPeak = (data: DataPoint[]): DataPoint => data.reduce((max: DataPoint, d: DataPoint) => d.value > max.value ? d : max, data[0]);

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#14B8A6',
        color: '#fff',
        fontFamily: "'Nunito Sans', sans-serif",
        fontSize: 13,
        padding: '4px 12px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(20,184,166,0.12)'
      }}>
        {payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    );
  }
  return null;
};

interface PeakLabelProps {
  x?: number;
  y?: number;
  value?: number;
  index?: number;
  data?: DataPoint[];
}

const PeakLabel: React.FC<PeakLabelProps> = (props) => {
  const { x = 0, y = 0, value, data = [] } = props;
  if (data.length === 0 || value === undefined) return null;
  const peak = getPeak(data);
  if (value !== peak.value) return null;
  return (
    <g>
      <rect x={x - 22} y={y - 36} rx={6} ry={6} width={44} height={24} fill="#10b981" />
      <text x={x} y={y - 20} textAnchor="middle" fill="#fff" fontWeight="bold" fontFamily="'Nunito Sans', sans-serif" fontSize={15}>
        {Math.round(value)}
      </text>
    </g>
  );
};

const SalesLineChart: React.FC<SalesLineChartProps> = ({
  data = defaultData,
  label = 'Sales Details',
  height = 220,
  months = defaultMonths,
  defaultMonth = 'July',
  onMonthChange
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    if (onMonthChange) onMonthChange(e.target.value);
  };

  return (
    <div className="dashboard-card" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, color: '#222', margin: 0 }}>{label}</h2>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '6px 18px',
            color: '#555',
            fontSize: 15,
            fontWeight: 600,
            background: '#fff',
            outline: 'none',
            cursor: 'pointer',
            fontFamily: "'Nunito Sans', sans-serif"
          }}
        >
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.18}/>
              <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 13, fontFamily: "'Nunito Sans', sans-serif" }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[20, 100]}
            ticks={[20, 40, 60, 80, 100]}
            tick={{ fill: '#bbb', fontSize: 13, fontFamily: "'Nunito Sans', sans-serif" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip active={false} payload={[]} />} cursor={{ stroke: '#10b981', strokeWidth: 2 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#colorValue)"
            dot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            activeDot={false}
            label={<PeakLabel data={data} />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesLineChart; 