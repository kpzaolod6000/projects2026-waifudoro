interface StatSummaryCardProps {
  title: string;
  value: string | number;
  subValue: string;
  subValueColor?: string;
  isPrimary?: boolean;
  icon?: React.ReactNode;
}

export function StatSummaryCard({
  title,
  value,
  subValue,
  subValueColor = 'text-green-500',
  isPrimary = false,
  icon,
}: StatSummaryCardProps) {
  if (isPrimary) {
    return (
      <div className="bg-primary p-6 rounded-3xl text-white shadow-lg shadow-primary/20">
        <p className="text-sm font-bold text-white/70 uppercase tracking-wider mb-2">{title}</p>
        <div className="flex items-center gap-2">
          <p className="text-4xl font-bold text-white">{value}</p>
          {icon && <div className="text-white opacity-80">{icon}</div>}
        </div>
        <p className="text-[10px] text-white/70 mt-2 font-bold uppercase">{subValue}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-primary/10 shadow-sm">
      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      <p className="text-4xl font-bold text-primary">{value}</p>
      <p className={`text-[10px] ${subValueColor} mt-2 font-bold`}>{subValue}</p>
    </div>
  );
}
