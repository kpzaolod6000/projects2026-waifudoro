import { Brain } from 'lucide-react';

interface DailySummaryCardProps {
  completed: number;
  total: number;
}

export function DailySummaryCard({ completed, total }: DailySummaryCardProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-primary/10 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
          <Brain size={20} />
        </div>
        <h4 className="font-bold text-lg dark:text-white">Daily Summary</h4>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        {completed === 0
          ? "No tasks completed yet. You've got this!"
          : `You've completed ${completed} of ${total} tasks today. Keep it up!`}
      </p>
      <div className="w-full bg-primary/20 h-2 rounded-full overflow-hidden mb-2">
        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs font-bold text-primary text-right">{percentage}%</p>
    </div>
  );
}
