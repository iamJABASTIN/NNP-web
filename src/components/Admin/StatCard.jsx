import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { BORDER_BLACK, SHADOW_BLACK } from '../../constants/adminStyles';

const StatCard = ({ name, value, change, color, chartData, isNegative }) => (
  <div style={{ backgroundColor: color }} className={`p-8 ${BORDER_BLACK} ${SHADOW_BLACK} flex items-center justify-between group hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300`}>
    <div className="flex flex-col gap-1">
      <p className="text-black font-black uppercase text-[10px] tracking-widest">{name}</p>
      <h3 className="text-[32px] font-black leading-none mb-3 tracking-tighter">{value}</h3>
      <div className="flex items-center gap-2">
        <div className={`w-5 h-5 rounded-none-none ${BORDER_BLACK} flex items-center justify-center bg-white shadow-[2px_2px_0px_#000000]`}>
          {isNegative ? <ArrowDown size={12} strokeWidth={4} /> : <ArrowUp size={12} strokeWidth={4} />}
        </div>
        <span className="text-[12px] font-black italic">{change}% (30 Days)</span>
      </div>
    </div>
    <div className="w-20 h-20">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData.map((v, i) => ({ v, i }))}>
          <Bar dataKey="v" fill="#000000" radius={[0, 0, 0, 0]} barSize={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default StatCard;
