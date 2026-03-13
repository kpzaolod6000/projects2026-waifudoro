export type TimerTab = 'work' | 'short' | 'long';

interface TimerTabsProps {
  activeTab: TimerTab;
  onTabChange: (tab: TimerTab) => void;
}

const tabs: { id: TimerTab; label: string }[] = [
  { id: 'work', label: 'Work Session' },
  { id: 'short', label: 'Short Break' },
  { id: 'long', label: 'Long Break' },
];

export function TimerTabs({ activeTab, onTabChange }: TimerTabsProps) {
  return (
    <div className="flex gap-4 mb-8 bg-primary/5 p-1 rounded-xl w-fit">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === tab.id
              ? 'bg-white dark:bg-slate-800 shadow-sm text-primary'
              : 'font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
