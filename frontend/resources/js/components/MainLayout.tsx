import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { navItems } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
  headerTitle: string;
}

export function MainLayout({ children, headerTitle }: MainLayoutProps) {
  const { user } = useAuth();

  const profile = user
    ? { name: user.username, level: user.level, xpCurrent: user.xpCurrent, xpNext: user.xpToNextLevel, avatarUrl: user.avatarUrl ?? '' }
    : { name: 'Guest', level: 1, xpCurrent: 0, xpNext: 1000, avatarUrl: '' };

  return (
    <div className="h-full flex overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-display transition-colors">
      <Sidebar userProfile={profile} navItems={navItems} />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header title={headerTitle} />
        <div className="flex-1 min-h-0 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
