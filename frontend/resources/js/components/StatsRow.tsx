import React from 'react';
import { StatInfo } from '../types';
import { Award, Timer, CheckCircle } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  military_tech: <Award size={24} />,
  schedule: <Timer size={24} />,
  task_alt: <CheckCircle size={24} />
};

interface StatsRowProps {
  stats: StatInfo[];
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/10 flex items-center gap-4 shadow-sm"
        >
          <div className={`size-12 rounded-xl flex items-center justify-center ${stat.colorClass}`}>
            {iconMap[stat.icon] || <span className="material-symbols-outlined">{stat.icon}</span>}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-xl font-bold dark:text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
