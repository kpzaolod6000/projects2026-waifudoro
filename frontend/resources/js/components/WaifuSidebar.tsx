import { useNavigate } from 'react-router-dom';
import { WaifuStatus } from '../types';
import { Flame } from 'lucide-react';

interface WaifuSidebarProps {
  status: WaifuStatus;
  className?: string;
}

export function WaifuSidebar({ status, className = '' }: WaifuSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className={`w-72 flex flex-col gap-3 min-h-0 ${className}`}>
      {/* Main waifu card — grows to fill available height */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-primary/10 shadow-sm flex flex-col">

        {/* Image area — fills all remaining space inside the card */}
        <div className="flex-1 min-h-0 relative overflow-hidden">
          <img
            className="absolute inset-0 w-full h-full object-cover object-top"
            src={status.imageUrl}
            alt="Companion character"
          />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
        </div>

        {/* Info section — fixed height at the bottom of the card */}
        <div className="flex-none p-5 pt-0">
          <div className="bg-primary/5 rounded-2xl p-3 mb-4 relative">
            <div className="absolute -top-2.5 left-4 size-3.5 bg-primary/5 rotate-45" />
            <p className="text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed font-medium line-clamp-3">
              {status.message}
            </p>
          </div>
          <div className="space-y-3 mb-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <span>Happiness</span>
                <span className="text-primary">{status.happiness}%</span>
              </div>
              <div className="w-full bg-primary/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all" style={{ width: `${status.happiness}%` }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <span>Energy</span>
                <span className="text-yellow-500">{status.energy}%</span>
              </div>
              <div className="w-full bg-yellow-100 dark:bg-yellow-900/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full transition-all" style={{ width: `${status.energy}%` }} />
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="w-full h-10 border-2 border-primary text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all"
          >
            INTERACT WITH HINA
          </button>
        </div>
      </div>

      {/* Streak card — fixed height */}
      <div className="flex-none bg-primary p-4 rounded-3xl text-white">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Current Streak</p>
          <Flame className="text-white" size={20} fill="currentColor" />
        </div>
        <p className="text-2xl font-bold">{status.streak} Days</p>
        <p className="text-[10px] opacity-70 mt-0.5 font-medium">Don't break the streak to win an epic chest!</p>
      </div>
    </div>
  );
}
