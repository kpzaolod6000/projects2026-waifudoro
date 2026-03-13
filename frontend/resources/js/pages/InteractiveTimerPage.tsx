import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { TimerCard } from '../components/TimerCard';
import { StatsRow } from '../components/StatsRow';
import { WaifuSidebar } from '../components/WaifuSidebar';
import { TimerTabs, TimerTab } from '../components/TimerTabs';
import { useAuth } from '../context/AuthContext';
import { sessions as sessionsApi, waifu as waifuApi, ApiWaifuStatus, ApiStatsSummary, statistics as statsApi } from '../lib/api';
import { StatInfo } from '../types';

const TAB_TYPE: Record<TimerTab, 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'> = {
  work: 'WORK',
  short: 'SHORT_BREAK',
  long: 'LONG_BREAK',
};

const DEFAULT_DURATIONS: Record<TimerTab, number> = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export function InteractiveTimerPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TimerTab>('work');
  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [waifuStatus, setWaifuStatus] = useState<ApiWaifuStatus | null>(null);
  const [summary, setSummary] = useState<ApiStatsSummary | null>(null);

  // Fetch real timer config + waifu + stats when authenticated
  useEffect(() => {
    if (!user) return;
    sessionsApi.timerConfig().then(cfg => {
      setDurations({ work: cfg.workDuration * 60, short: cfg.shortBreakDuration * 60, long: cfg.longBreakDuration * 60 });
    }).catch(() => {});
    waifuApi.status().then(setWaifuStatus).catch(() => {});
    statsApi.summary().then(setSummary).catch(() => {});
  }, [user]);

  const handleSessionComplete = async () => {
    if (!user) return;
    try {
      await sessionsApi.record(TAB_TYPE[activeTab], durations[activeTab] / 60);
      // Refresh stats + waifu after a completed session
      const [newSummary, newWaifu] = await Promise.all([statsApi.summary(), waifuApi.status()]);
      setSummary(newSummary);
      setWaifuStatus(newWaifu);
    } catch { /* silent */ }
  };

  const statsRow: StatInfo[] = summary
    ? [
        { id: 'xp_today', label: 'XP Earned Today', value: `${summary.xpEarnedToday} XP`, icon: 'military_tech', colorClass: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
        { id: 'focus_time', label: 'Total Focus Time', value: `${Math.floor(summary.totalHoursFocused)}h ${Math.round((summary.totalHoursFocused % 1) * 60)}m`, icon: 'schedule', colorClass: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
        { id: 'missions', label: 'Missions', value: `${summary.missionsCompleted} done`, icon: 'task_alt', colorClass: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
      ]
    : [];

  // ── Guest mode: bare timer with sign-in banner ────────────────────────────
  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-[#171121] font-display px-4">
        <div className="w-full max-w-sm bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4 text-center">
          <p className="text-sm font-bold text-primary">
            Sign in to unlock XP, tasks, statistics and your companion!
          </p>
          <div className="flex gap-3 justify-center mt-3">
            <Link to="/login" className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all">Log In</Link>
            <Link to="/register" className="px-5 py-2 border-2 border-primary text-primary rounded-xl text-sm font-bold hover:bg-primary/10 transition-all">Sign Up</Link>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <TimerTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <TimerCard duration={DEFAULT_DURATIONS[activeTab]} className="w-full max-w-sm" />
      </div>
    );
  }

  // ── Authenticated: full layout ────────────────────────────────────────────
  return (
    <MainLayout headerTitle="Timer">
      <div className="h-full flex flex-col">
        <div className="flex-none px-8 pt-6 pb-0">
          <TimerTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="flex-1 min-h-0 flex gap-6 px-8 pb-6 pt-4">
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <TimerCard
              duration={durations[activeTab]}
              className="flex-1 min-h-0"
              onComplete={handleSessionComplete}
            />
            {statsRow.length > 0 && <StatsRow stats={statsRow} />}
          </div>
          {waifuStatus && (
            <WaifuSidebar status={{ happiness: waifuStatus.happiness, energy: waifuStatus.energy, message: waifuStatus.message, imageUrl: waifuStatus.imageUrl, streak: waifuStatus.streak }} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
