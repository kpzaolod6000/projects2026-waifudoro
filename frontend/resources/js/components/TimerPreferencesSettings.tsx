import { useState, useEffect } from 'react';
import { users as usersApi, ApiSettings } from '../lib/api';

interface TimerPreferencesSettingsProps {
  onSettingsChange?: (settings: Partial<ApiSettings>) => void;
}

export function TimerPreferencesSettings({ onSettingsChange }: TimerPreferencesSettingsProps) {
  const [notificationSound, setNotificationSound] = useState(true);
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);

  useEffect(() => {
    usersApi.getSettings().then(s => {
      setNotificationSound(s.notificationSound);
      setWorkDuration(s.workDuration);
      setShortBreak(s.shortBreakDuration);
      setLongBreak(s.longBreakDuration);
    }).catch(() => {});
  }, []);

  const notify = (patch: Partial<ApiSettings>) => onSettingsChange?.(patch);

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Timer Preferences</h4>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Work (min)', value: workDuration, set: (v: number) => { setWorkDuration(v); notify({ workDuration: v }); } },
          { label: 'Short Break', value: shortBreak,  set: (v: number) => { setShortBreak(v);  notify({ shortBreakDuration: v }); } },
          { label: 'Long Break',  value: longBreak,   set: (v: number) => { setLongBreak(v);   notify({ longBreakDuration: v }); } },
        ].map(({ label, value, set }) => (
          <div key={label} className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</label>
            <input
              type="number"
              min={1}
              max={120}
              value={value}
              onChange={e => set(Number(e.target.value))}
              className="w-full px-3 py-2 bg-primary/5 dark:bg-slate-800/50 outline-none border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl">
        <div>
          <p className="font-bold text-slate-900 dark:text-white">Notification Sound</p>
          <p className="text-sm text-slate-500 font-medium">Play a sound when time is up</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={notificationSound}
            onChange={e => { setNotificationSound(e.target.checked); notify({ notificationSound: e.target.checked }); }}
          />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
        </label>
      </div>
    </div>
  );
}
