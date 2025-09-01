import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// Define types for the earnings chart data
export interface ChartDataPoint {
  x: string;
  y: number;
}

export interface TrendAnalysis {
  slope: number;
  intercept: number;
  r_squared: number;
  trend_points: number[];
}

export interface EarningsChartData {
  chart_data: ChartDataPoint[];
  trend_analysis: TrendAnalysis;
  peak_earnings: number;
  peak_day: number;
  total_month_earnings: number;
  average_daily_earnings: number;
}

interface SalesLineChartProps {
  data?: EarningsChartData;
  label?: string;
  height?: number;
  loading?: boolean;
  error?: string | null;
  months?: string[];
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
}

const defaultData: EarningsChartData = {
  chart_data: [
    { x: '5k', y: 20 },
    { x: '10k', y: 45 },
    { x: '15k', y: 50 },
    { x: '20k', y: 64.3664 },
    { x: '25k', y: 45 },
    { x: '30k', y: 60 },
    { x: '35k', y: 20 },
    { x: '40k', y: 35 },
    { x: '45k', y: 75 },
    { x: '50k', y: 55 },
    { x: '55k', y: 55 },
    { x: '60k', y: 60 }
  ],
  trend_analysis: {
    slope: 0,
    intercept: 0,
    r_squared: 0,
    trend_points: []
  },
  peak_earnings: 0,
  peak_day: 0,
  total_month_earnings: 0,
  average_daily_earnings: 0
};

const defaultMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getPeak = (data: ChartDataPoint[]): ChartDataPoint => data.reduce((max: ChartDataPoint, d: ChartDataPoint) => d.y > max.y ? d : max, data[0]);

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
  data?: ChartDataPoint[];
}

const PeakLabel: React.FC<PeakLabelProps> = (props) => {
  const { x = 0, y = 0, value, data = [] } = props;
  if (data.length === 0 || value === undefined) return null;
  const peak = getPeak(data);
  if (value !== peak.y) return null;
  return (
    <g>
      <rect x={x - 22} y={y - 36} rx={6} ry={6} width={44} height={24} fill="#10b981" />
      <text x={x} y={y - 20} textAnchor="middle" fill="#fff" fontWeight="bold" fontFamily="'Nunito Sans', sans-serif" fontSize={15}>
        {Math.round(value)}
      </text>
    </g>
  );
};

const SalesLineChart: React.FC<SalesLineChartProps> = (props) => {
  const { 
    data = defaultData, 
    label = 'Sales Details', 
    height = 220,
    months = defaultMonths,
    defaultMonth = 'July',
    onMonthChange
  } = props;
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);
  
  const chartData = data?.chart_data || [];

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    onMonthChange?.(e.target.value);
  };

  return (
    <div className="dashboard-card" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, color: '#222', margin: 0 }}>{label}</h2>
        <select 
          value={selectedMonth}
          onChange={handleMonthChange}
          className="text-sm border rounded px-2 py-1 bg-white"
        >
          {months.map((month: string) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.18}/>
              <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="x" tick={{ fill: '#888', fontSize: 13, fontFamily: "'Nunito Sans', sans-serif" }} axisLine={false} tickLine={false} />
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
            dataKey="y" 
            stroke="#10b981" 
            fill="url(#colorValue)" 
            strokeWidth={2}
            dot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            activeDot={false}
            label={<PeakLabel data={chartData} />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesLineChart; 