import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { auth as authApi, setToken, ApiUser } from '../lib/api';

interface AuthContextValue {
  user: ApiUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: try to restore session via refresh cookie
  useEffect(() => {
    authApi.refresh()
      .then(async ({ accessToken }) => {
        setToken(accessToken);
        // Fetch the full user profile
        const { users } = await import('../lib/api');
        const me = await users.me();
        setUser(me);
      })
      .catch(() => { /* no valid session — stay as guest */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, user: me } = await authApi.login(email, password);
    setToken(accessToken);
    setUser(me);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const { accessToken, user: me } = await authApi.register(username, email, password);
    setToken(accessToken);
    setUser(me);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
