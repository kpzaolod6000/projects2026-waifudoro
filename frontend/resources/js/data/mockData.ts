import { UserProfile, NavItem, StatInfo, WaifuStatus, Task } from '../types';

export const userProfile: UserProfile = {
  name: 'Alex_Kun',
  level: 15,
  xpCurrent: 650,
  xpNext: 1000,
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUSmQMWWQBln-1T-03hWkXCObL36W6horarpVb3jS2DqzncvNVb-K0EQHvSvIeKJdD1M6ZHSl12cK4LE7B6ylusSLimp1IMIoTBI2mHbDFfIvOQ0KgTFSXKbFqcKQpF6G_cf4ld4u_D5S9p7Fqmy1u_FqfWcE6VQhyD7p34-EWHJZnxtSp8h9VyQz4rwDj6OD7mhOKACHxjCuvGZMx6BbNbA6ge3iH91ZuMPPKtIR2NXMnsZ1NezjDNtzAM1KKtbEQnMJrxFQCZADC',
};

export const navItems: NavItem[] = [
  { id: 'timer', label: 'Timer', icon: 'schedule', path: '/timer' },
  { id: 'tasks', label: 'Tasks', icon: 'checklist', path: '/tasks' },
  { id: 'stats', label: 'Statistics', icon: 'bar_chart', path: '/statistics' },
  { id: 'chat', label: 'Chat with waifu', icon: 'chat_bubble', path: '/chat' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
];

export const staticStats: StatInfo[] = [
  {
    id: 'xp_today',
    label: 'XP Earned Today',
    value: '450 XP',
    icon: 'military_tech',
    colorClass: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
  },
  {
    id: 'focus_time',
    label: 'Total Focus Time',
    value: '3h 25m',
    icon: 'schedule',
    colorClass: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 'missions',
    label: 'Missions',
    value: '12 / 15',
    icon: 'task_alt',
    colorClass: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  },
];

export const waifuData: WaifuStatus = {
  happiness: 85,
  energy: 60,
  message: '"You can do it, Onii-chan! Only a few minutes left to finish this session. Ganbatte!"',
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANoXVA0N3mXNqZV-GOmaYJkQoQ6di51K1LOTsJtmFeHebwVKo2Emo9Z5GNkeMalbOzH4vzWr2E9CeNOSTeOB9rG6ecY7bsVd07uOVtCgA4Pf-sNjhp55slwdMEoI_E8NoQKhUjV_r7g8reo1eX0EdaA4Hk2tKouAEz4oMVjVMdyAoV0vsGAW0ytygZarBJs2K8WxeFja30WS0ZMWnx6Zob7HkhWgU2KEmzHfMmRaK55tiPcxEr5YYsf4L6Gm3ZK8HZPPEJIG-0_ZLb',
  streak: 12,
};

export const initialTasks: Task[] = [
  { id: 1, title: 'Finish User Interface', tags: ['Development'], time: '2 Pomodoros', completed: false },
  { id: 2, title: 'Study Japanese (Kanji)', tags: ['Study'], time: '1 Pomodoro', completed: false },
  { id: 3, title: 'Check Emails', tags: ['Work'], time: 'Completed', completed: true },
];

export const weeklyActivity = [
  { day: 'MON', value: 40 },
  { day: 'TUE', value: 70 },
  { day: 'WED', value: 45 },
  { day: 'THU', value: 90 },
  { day: 'FRI', value: 60 },
  { day: 'SAT', value: 20 },
  { day: 'SUN', value: 50 },
];
