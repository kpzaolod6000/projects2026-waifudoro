// ── Token store (in-memory, never persisted to localStorage) ─────────────────
let _accessToken: string | null = null;

export function setToken(token: string | null) { _accessToken = token; }
export function getToken() { return _accessToken; }

// ── Custom error ──────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(public status: number, public body: Record<string, unknown>) {
    super((body?.error as string) ?? `HTTP ${status}`);
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;

  const res = await fetch(`${API_BASE_URL}/api${path}`, { ...options, headers, credentials: 'include' });

  // Silent token refresh on 401 (except the refresh call itself)
  if (res.status === 401 && path !== '/auth/refresh') {
    const refreshed = await fetch(`${API_BASE_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
    if (refreshed.ok) {
      const data = await refreshed.json();
      _accessToken = data.accessToken;
      headers['Authorization'] = `Bearer ${_accessToken}`;
      const retry = await fetch(`${API_BASE_URL}/api${path}`, { ...options, headers, credentials: 'include' });
      if (!retry.ok) throw new ApiError(retry.status, await retry.json().catch(() => ({})));

      if (retry.status === 204) return undefined as T;
      return retry.json();
    }
    _accessToken = null;
    throw new ApiError(401, { error: 'Session expired' });
  }

  if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => ({})));
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  register: (username: string, email: string, password: string) =>
    request<{ accessToken: string; user: ApiUser }>('/auth/register', {
      method: 'POST', body: JSON.stringify({ username, email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ accessToken: string; user: ApiUser; leveledUp: boolean }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),
  refresh: () =>
    request<{ accessToken: string }>('/auth/refresh', { method: 'POST' }),
  logout: () =>
    request<void>('/auth/logout', { method: 'POST' }),
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = {
  me: () => request<ApiUser>('/users/me'),
  updateMe: (data: Partial<Pick<ApiUser, 'username' | 'email' | 'avatarUrl'>>) =>
    request<ApiUser>('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<void>('/users/me/password', { method: 'PATCH', body: JSON.stringify({ currentPassword, newPassword }) }),
  getSettings: () => request<ApiSettings>('/users/me/settings'),
  updateSettings: (data: Partial<ApiSettings>) =>
    request<ApiSettings>('/users/me/settings', { method: 'PATCH', body: JSON.stringify(data) }),
};

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const tasks = {
  list: (completed?: boolean) =>
    request<{ data: ApiTask[] }>(`/tasks${completed !== undefined ? `?completed=${completed}` : ''}`),
  create: (title: string, tags: string[] = [], estimatedPomodoros = 1) =>
    request<ApiTask>('/tasks', { method: 'POST', body: JSON.stringify({ title, tags, estimatedPomodoros }) }),
  toggle: (id: string) =>
    request<{ task: ApiTask; xp: XpResult | null }>(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  delete: (id: string) =>
    request<void>(`/tasks/${id}`, { method: 'DELETE' }),
};

// ── Sessions ──────────────────────────────────────────────────────────────────
export const sessions = {
  record: (type: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK', durationMin: number, taskId?: string) =>
    request<{ session: { id: string; type: string; xpEarned: number }; user: XpResult }>('/sessions', {
      method: 'POST', body: JSON.stringify({ type, durationMin, taskId }),
    }),
  timerConfig: () => request<{ workDuration: number; shortBreakDuration: number; longBreakDuration: number }>('/sessions/timer/config'),
};

// ── Statistics ────────────────────────────────────────────────────────────────
export const statistics = {
  summary: () => request<ApiStatsSummary>('/statistics/summary'),
  weekly: () => request<{ data: { day: string; sessions: number; focusMinutes: number }[] }>('/statistics/weekly'),
};

// ── Waifu ─────────────────────────────────────────────────────────────────────
export const waifu = {
  status: () => request<ApiWaifuStatus>('/waifu/status'),
  interact: (event: 'SESSION_COMPLETED' | 'TASK_COMPLETED' | 'STREAK_BROKEN' | 'DAILY_LOGIN') =>
    request<ApiWaifuStatus>('/waifu/interact', { method: 'POST', body: JSON.stringify({ event }) }),
};

// ── Chat ──────────────────────────────────────────────────────────────────────
export const chat = {
  history: (limit = 50) => request<{ data: ApiMessage[] }>(`/chat/history?limit=${limit}`),
  send: (message: string) =>
    request<{ userMessage: ApiMessage; waifuReply: ApiMessage }>('/chat/message', {
      method: 'POST', body: JSON.stringify({ message }),
    }),
};

// ── Shared API types ──────────────────────────────────────────────────────────
export interface ApiUser {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  level: number;
  xpCurrent: number;
  xpToNextLevel: number;
  totalXp: number;
  streak: number;
}

export interface ApiSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  notificationSound: boolean;
  theme: 'light' | 'dark';
}

export interface ApiTask {
  id: string;
  title: string;
  tags: string[];
  estimatedPomodoros: number;
  completed: boolean;
  completedAt: string | null;
}

export interface ApiWaifuStatus {
  name: string;
  happiness: number;
  energy: number;
  streak: number;
  message: string;
  imageUrl: string;
}

export interface ApiStatsSummary {
  totalPomodoros: number;
  totalHoursFocused: number;
  missionsCompleted: number;
  successRate: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  xpCurrent: number;
  xpToNextLevel: number;
  xpEarnedToday: number;
}

export interface ApiMessage {
  id: string;
  isUser: boolean;
  message: string;
  createdAt: string;
}

interface XpResult {
  level: number;
  xpCurrent: number;
  xpToNextLevel: number;
  leveledUp: boolean;
}
