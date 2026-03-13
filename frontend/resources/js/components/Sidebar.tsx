import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserProfile, NavItem } from '../types';
import { Timer, CheckSquare, BarChart2, MessageCircle, Settings, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const iconMap: Record<string, React.ReactNode> = {
  schedule:    <Timer size={20} />,
  checklist:   <CheckSquare size={20} />,
  bar_chart:   <BarChart2 size={20} />,
  chat_bubble: <MessageCircle size={20} />,
  settings:    <Settings size={20} />,
};

interface SidebarProps {
  userProfile: UserProfile;
  navItems: NavItem[];
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150">
      {label}
    </span>
  );
}

export function Sidebar({ userProfile, navItems }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const xpPercentage = (userProfile.xpCurrent / userProfile.xpNext) * 100;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Compact icon rail */}
      <aside className="w-16 flex-none bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col items-center py-4 gap-2 z-20">
        <div className="relative group mb-4">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation"
            className="size-10 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Timer size={22} strokeWidth={2.5} />
          </button>
          <Tooltip label="WaifuDoro" />
        </div>

        <nav className="flex flex-col gap-1 flex-1 w-full items-center">
          {navItems.map(item => (
            <div key={item.id} className="relative group w-full flex justify-center">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `size-10 flex items-center justify-center rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'
                  }`
                }
              >
                {iconMap[item.icon]}
              </NavLink>
              <Tooltip label={item.label} />
            </div>
          ))}
        </nav>

        <div className="relative group">
          <div
            className="size-10 rounded-full bg-cover bg-center border-2 border-primary cursor-pointer bg-primary/20"
            style={userProfile.avatarUrl ? { backgroundImage: `url('${userProfile.avatarUrl}')` } : {}}
          />
          <Tooltip label={`${userProfile.name} · Lv.${userProfile.level}`} />
        </div>
      </aside>

      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col p-4 z-40 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 flex-none bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Timer size={22} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-primary tracking-tight leading-none">WaifuDoro</h1>
              <p className="text-[10px] text-primary/60 font-medium">Gamified Productivity</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
            className="flex-none size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'hover:bg-primary/5 text-slate-600 dark:text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {iconMap[item.icon]}
                  <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile card */}
        <div className="bg-primary/5 rounded-2xl p-4 flex flex-col gap-3 mt-4">
          <div className="flex items-center gap-3">
            <div
              className="size-10 flex-none rounded-full bg-cover bg-center border-2 border-primary bg-primary/20"
              style={userProfile.avatarUrl ? { backgroundImage: `url('${userProfile.avatarUrl}')` } : {}}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-none truncate">{userProfile.name}</p>
              <p className="text-xs text-primary font-bold">Level {userProfile.level}</p>
            </div>
          </div>
          <div className="w-full bg-primary/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all" style={{ width: `${xpPercentage}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-medium">
            {userProfile.xpCurrent} / {userProfile.xpNext} XP to Level {userProfile.level + 1}
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
