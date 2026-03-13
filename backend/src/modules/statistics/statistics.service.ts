import { getDB, ObjectId } from '../../config/db';

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export async function getSummary(userId: string) {
  const db = getDB();
  const oid = new ObjectId(userId);

  const user = await db.collection('users').findOne({ _id: oid });
  if (!user) throw new Error('User not found');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalPomodoros, todaySessions, missionsCompleted, totalTasks, allSessions] = await Promise.all([
    db.collection('pomodoroSessions').countDocuments({ userId: oid, type: 'WORK' }),
    db.collection('pomodoroSessions').find({ userId: oid, type: 'WORK', completedAt: { $gte: today } }).toArray(),
    db.collection('tasks').countDocuments({ userId: oid, completed: true }),
    db.collection('tasks').countDocuments({ userId: oid }),
    db.collection('pomodoroSessions').find({ userId: oid, type: 'WORK' }, { projection: { durationMin: 1 } }).toArray(),
  ]);

  const totalHoursFocused = Math.round((allSessions.reduce((acc, s) => acc + s.durationMin, 0) / 60) * 10) / 10;
  const xpEarnedToday = todaySessions.length * 50;
  const successRate = totalTasks > 0 ? Math.round((missionsCompleted / totalTasks) * 100) : 0;

  return {
    totalPomodoros,
    totalHoursFocused,
    missionsCompleted,
    successRate,
    currentStreak: user.streak,
    bestStreak: user.streak,
    level: user.level,
    xpCurrent: user.xpCurrent,
    xpToNextLevel: user.xpToNextLevel,
    xpEarnedToday,
  };
}

export async function getWeeklyActivity(userId: string) {
  const db = getDB();
  const oid = new ObjectId(userId);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const sessions = await db.collection('pomodoroSessions')
    .find({ userId: oid, type: 'WORK', completedAt: { $gte: weekStart } }, { projection: { completedAt: 1, durationMin: 1 } })
    .toArray();

  const map: Record<string, { sessions: number; focusMinutes: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    map[DAY_NAMES[d.getDay()]] = { sessions: 0, focusMinutes: 0 };
  }

  for (const s of sessions) {
    const key = DAY_NAMES[new Date(s.completedAt).getDay()];
    if (map[key]) {
      map[key].sessions += 1;
      map[key].focusMinutes += s.durationMin;
    }
  }

  return { data: Object.entries(map).map(([day, val]) => ({ day, ...val })) };
}

export async function getXpHistory(userId: string) {
  const db = getDB();
  const sessions = await db.collection('pomodoroSessions')
    .find({ userId: new ObjectId(userId) }, { projection: { completedAt: 1, xpEarned: 1 } })
    .sort({ completedAt: 1 })
    .limit(30)
    .toArray();

  let cumulative = 0;
  return {
    data: sessions.map(s => {
      cumulative += s.xpEarned;
      return { date: s.completedAt, xp: cumulative };
    }),
  };
}
