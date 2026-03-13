import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { users as usersApi } from '../lib/api';

interface UserProfileSettingsProps {
  onSave?: () => void;
}

export function UserProfileSettings({ onSave }: UserProfileSettingsProps) {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  if (onSave) {
    // Let parent trigger save — expose via ref would be cleaner but this keeps it simple
  }

  return (
    <div className="flex flex-col gap-4 pb-8 border-b border-slate-100 dark:border-slate-800">
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">User Profile</h4>
      <div className="flex items-center gap-6">
        <div
          className="size-20 rounded-full bg-cover bg-center border-2 border-primary bg-primary/20"
          style={user?.avatarUrl ? { backgroundImage: `url('${user.avatarUrl}')` } : {}}
          title="User avatar"
        />
        <button className="px-6 py-2 rounded-lg text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          Change Avatar
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-primary/5 dark:bg-slate-800/50 outline-none border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-primary/5 dark:bg-slate-800/50 outline-none border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
}
