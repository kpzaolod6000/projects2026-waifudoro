interface LevelXPCardProps {
  level: number;
  xpCurrent: number;
  xpToNextLevel: number;
}

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function LevelXPCard({ level, xpCurrent, xpToNextLevel }: LevelXPCardProps) {
  const progress = xpCurrent / xpToNextLevel;
  const strokeOffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-primary/10 shadow-sm flex flex-col items-center">
      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 w-full text-left">Level & XP</h4>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative size-40 flex items-center justify-center">
          <svg className="size-40 -rotate-90 absolute">
            <circle cx="80" cy="80" r={RADIUS} fill="transparent" stroke="currentColor" strokeWidth="8" className="text-primary/10" />
            <circle cx="80" cy="80" r={RADIUS} fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-primary transition-all duration-700" style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: strokeOffset }} />
          </svg>
          <div className="text-center">
            <p className="text-xs font-bold text-primary uppercase">Level</p>
            <p className="text-4xl font-bold dark:text-white">{level}</p>
          </div>
        </div>
        <p className="text-sm font-bold text-slate-500 mt-6">{xpCurrent} / {xpToNextLevel} XP</p>
        <p className="text-xs text-slate-400 mt-1">{Math.round(progress * 100)}% to Level {level + 1}</p>
      </div>
    </div>
  );
}
