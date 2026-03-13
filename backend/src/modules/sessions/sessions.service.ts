import { getDB, ObjectId } from '../../config/db';
import { applyXp, XP_PER_SESSION } from '../../utils/xp';
import { updateStreak } from '../../utils/streak';
import { updateWaifuStats } from '../waifu/waifu.service';
import { CreateSessionDto } from './sessions.schema';

export async function recordSession(userId: string, dto: CreateSessionDto) {
  const db = getDB();
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  if (!user) throw new Error('User not found');

  const xpGained = dto.type === 'WORK' ? XP_PER_SESSION : 0;
  const { state: xpState, leveledUp } = applyXp(
    { level: user.level, xpCurrent: user.xpCurrent, xpToNextLevel: user.xpToNextLevel, totalXp: user.totalXp },
    xpGained
  );

  const { streak, lastActiveDate } = updateStreak(user.streak, user.lastActiveDate);
  const now = new Date();

  const sessionResult = await db.collection('pomodoroSessions').insertOne({
    userId: new ObjectId(userId),
    type: dto.type,
    durationMin: dto.durationMin,
    taskId: dto.taskId ? new ObjectId(dto.taskId) : null,
    xpEarned: xpGained,
    completedAt: now,
  });

  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { ...xpState, streak, lastActiveDate, updatedAt: now } }
  );

  if (dto.type === 'WORK') {
    await updateWaifuStats(userId, 'SESSION_COMPLETED');
  }

  return {
    session: { id: sessionResult.insertedId.toString(), type: dto.type, xpEarned: xpGained },
    user: { level: xpState.level, xpCurrent: xpState.xpCurrent, xpToNextLevel: xpState.xpToNextLevel, leveledUp },
  };
}

export async function listSessions(userId: string, from?: string, to?: string) {
  const db = getDB();
  const filter: Record<string, unknown> = { userId: new ObjectId(userId) };
  if (from || to) {
    filter.completedAt = {
      ...(from ? { $gte: new Date(from) } : {}),
      ...(to ? { $lte: new Date(to) } : {}),
    };
  }
  const sessions = await db.collection('pomodoroSessions').find(filter).sort({ completedAt: -1 }).toArray();
  return sessions.map(s => ({ ...s, id: s._id.toString(), _id: undefined }));
}

export function getDefaultTimerConfig() {
  return { workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15 };
}

export async function getUserTimerConfig(userId: string) {
  const db = getDB();
  const settings = await db.collection('userSettings').findOne({ userId: new ObjectId(userId) });
  if (!settings) return getDefaultTimerConfig();
  return {
    workDuration: settings.workDuration,
    shortBreakDuration: settings.shortBreakDuration,
    longBreakDuration: settings.longBreakDuration,
  };
}
