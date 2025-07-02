import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
  budgetCount: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  className?: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('es-AR', { month: 'short' });
            }}
          />
          <YAxis 
            yAxisId="revenue"
            orientation="left"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis 
            yAxisId="count"
            orientation="right"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'revenue') {
                return [`$${value.toLocaleString()}`, 'Ingresos'];
              }
              return [value, 'Cantidad de Presupuestos'];
            }}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('es-AR', { 
                month: 'long', 
                year: 'numeric' 
              });
            }}
          />
          <Legend />
          <Bar 
            yAxisId="revenue"
            dataKey="revenue" 
            fill="#3b82f6" 
            name="Ingresos"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            yAxisId="count"
            dataKey="budgetCount" 
            fill="#10b981" 
            name="Presupuestos"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart; 