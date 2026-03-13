import { useState } from 'react';
import { Search, Bell, UserCircle, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(prev => !prev);
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-primary/5 sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <div className="relative w-72">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <input
            className="w-full pl-10 pr-4 py-2 bg-primary/5 dark:bg-slate-800/50 outline-none border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
            placeholder="Search missions or tags..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-primary/10 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-primary/10 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
          <Bell size={20} />
        </button>
        <button className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-primary/10 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
          <UserCircle size={20} />
        </button>
      </div>
    </header>
  );
}
