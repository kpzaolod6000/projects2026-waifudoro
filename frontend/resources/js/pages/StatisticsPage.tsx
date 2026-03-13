import { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { StatSummaryCard } from '../components/StatSummaryCard';
import { WeeklyActivityChart } from '../components/WeeklyActivityChart';
import { LevelXPCard } from '../components/LevelXPCard';
import { Flame } from 'lucide-react';
import { statistics as statsApi, ApiStatsSummary } from '../lib/api';

export function StatisticsPage() {
  const [summary, setSummary] = useState<ApiStatsSummary | null>(null);
  const [weekly, setWeekly] = useState<{ day: string; value: number }[]>([]);

  useEffect(() => {
    statsApi.summary().then(setSummary).catch(() => {});
    statsApi.weekly().then(res => {
      setWeekly(res.data.map(d => ({ day: d.day, value: d.sessions })));
    }).catch(() => {});
  }, []);

  return (
    <MainLayout headerTitle="Statistics">
      <div className="h-full overflow-y-auto">
        <div className="p-8 max-w-[1200px] flex flex-col gap-8">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatSummaryCard title="Total Pomodoros"     value={summary?.totalPomodoros ?? 0}        subValue="All time" />
            <StatSummaryCard title="Hours Focused"       value={summary?.totalHoursFocused ?? 0}     subValue="All time" />
            <StatSummaryCard title="Missions Completed"  value={summary?.missionsCompleted ?? 0}     subValue={`Success rate ${summary?.successRate ?? 0}%`} subValueColor="text-slate-500" />
            <StatSummaryCard title="Daily Streak"        value={summary?.currentStreak ?? 0}         subValue={`Best: ${summary?.bestStreak ?? 0}`} isPrimary icon={<Flame size={32} fill="currentColor" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <WeeklyActivityChart data={weekly.length > 0 ? weekly : undefined} />
            <LevelXPCard
              level={summary?.level ?? 1}
              xpCurrent={summary?.xpCurrent ?? 0}
              xpToNextLevel={summary?.xpToNextLevel ?? 1000}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
