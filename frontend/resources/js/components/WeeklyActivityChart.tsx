const EMPTY: { day: string; value: number }[] = [];

interface WeeklyActivityChartProps {
  data?: { day: string; value: number }[];
}

export function WeeklyActivityChart({ data = EMPTY }: WeeklyActivityChartProps) {
  const max = data.length > 0 ? Math.max(...data.map(d => d.value), 1) : 1;

  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-primary/10 shadow-sm">
      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Weekly Activity</h4>
      <div className="h-64 flex items-end justify-between gap-4 pt-10">
        {data.map(({ day, value }) => (
          <div key={day} className="w-full max-w-16 bg-primary/10 dark:bg-primary/20 rounded-t-xl group relative h-full flex flex-col justify-end">
            <div
              className="w-full bg-primary rounded-t-xl transition-all duration-700 group-hover:bg-primary/80"
              style={{ height: `${(value / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
        {data.map(({ day }) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  );
}
