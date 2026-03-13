import { useState, useEffect } from 'react';
import { RotateCcw, Play, Pause, CheckCircle, X } from 'lucide-react';

interface TimerCardProps {
  duration: number;
  className?: string;
  onComplete?: () => void;
}

const RADIUS = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerCard({ duration, className = '', onComplete }: TimerCardProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      onComplete?.();
    }
    return () => { if (timerId) clearInterval(timerId); };
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => { setIsCompleted(false); setIsActive(prev => !prev); };
  const resetTimer  = () => { setIsActive(false); setIsCompleted(false); setTimeLeft(duration); };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const strokeOffset = CIRCUMFERENCE - ((duration - timeLeft) / duration) * CIRCUMFERENCE;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-primary/10 shadow-sm flex flex-col items-center justify-center relative overflow-hidden p-8 ${className}`}>

      {isCompleted && (
        <div className="absolute inset-x-0 top-0 bg-green-500 text-white flex items-center justify-between px-5 py-3 z-10">
          <div className="flex items-center gap-2 text-sm font-bold">
            <CheckCircle size={16} />
            Session complete! Great work.
          </div>
          <button onClick={() => setIsCompleted(false)} className="text-white/70 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="absolute top-0 right-0 p-5">
        <button className="text-slate-400 hover:text-primary transition-colors" onClick={resetTimer}>
          <RotateCcw size={22} />
        </button>
      </div>

      <div className="relative flex items-center justify-center mb-8">
        <svg className="size-56 -rotate-90">
          <circle className="text-primary/10" cx="112" cy="112" fill="transparent" r={RADIUS} stroke="currentColor" strokeWidth="8" />
          <circle
            className="text-primary transition-all duration-1000 ease-linear"
            cx="112" cy="112" fill="transparent" r={RADIUS}
            stroke="currentColor" strokeLinecap="round" strokeWidth="10"
            style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: strokeOffset }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-6xl font-bold tracking-tighter text-slate-900 dark:text-white">{displayTime}</span>
          <span className="text-xs font-bold tracking-[0.3em] text-primary mt-2">FOCUS</span>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        {!isActive ? (
          <button
            onClick={toggleTimer}
            className="flex-1 h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Play fill="currentColor" size={20} />
            {isCompleted ? 'Restart' : 'Start'}
          </button>
        ) : (
          <button
            onClick={toggleTimer}
            className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Pause fill="currentColor" size={20} />
            Pause
          </button>
        )}
      </div>
    </div>
  );
}
