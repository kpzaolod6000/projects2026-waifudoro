import { useState, useRef } from 'react';
import { MainLayout } from '../components/MainLayout';
import { UserProfileSettings } from '../components/UserProfileSettings';
import { TimerPreferencesSettings } from '../components/TimerPreferencesSettings';
import { CheckCircle } from 'lucide-react';
import { users as usersApi, ApiSettings } from '../lib/api';

export function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const pendingSettings = useRef<Partial<ApiSettings>>({});

  const handleSave = async () => {
    setSaving(true);
    try {
      if (Object.keys(pendingSettings.current).length > 0) {
        await usersApi.updateSettings(pendingSettings.current);
        pendingSettings.current = {};
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* show nothing — user will retry */ }
    finally { setSaving(false); }
  };

  return (
    <MainLayout headerTitle="Settings">
      <div className="h-full overflow-y-auto">
        <div className="p-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-primary/10 shadow-sm max-w-3xl">
            <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Account Settings</h3>
            <div className="flex flex-col gap-8">
              <UserProfileSettings />
              <TimerPreferencesSettings
                onSettingsChange={patch => { pendingSettings.current = { ...pendingSettings.current, ...patch }; }}
              />
              <div className="flex items-center justify-end gap-4 mt-4">
                {saved && (
                  <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                    <CheckCircle size={16} />
                    Changes saved!
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 h-12 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
