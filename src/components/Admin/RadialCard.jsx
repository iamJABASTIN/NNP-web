import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const RadialCard = ({ value, displayValue, label, color }) => {
  const data = [{ value }, { value: 100 - value }];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={35}
              outerRadius={50}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              stroke="#000000"
              strokeWidth={2}
            >
              <Cell fill={color} />
              <Cell fill="#ffffff" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black">{displayValue ?? `${value}%`}</span>
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">{label}</p>
    </div>
  );
};

export default RadialCard;
