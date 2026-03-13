import bcrypt from 'bcryptjs';
import { getDB, ObjectId } from '../../config/db';
import { NotFoundError, ConflictError, UnauthorizedError } from '../../utils/response';

export async function getMe(userId: string) {
  const db = getDB();
  const user = await db.collection('users').findOne(
    { _id: new ObjectId(userId) },
    { projection: { passwordHash: 0 } }
  );
  if (!user) throw new NotFoundError('User not found');
  return { ...user, id: user._id.toString(), _id: undefined };
}

export async function updateMe(userId: string, data: { username?: string; email?: string; avatarUrl?: string }) {
  const db = getDB();

  if (data.email) {
    const exists = await db.collection('users').findOne({ email: data.email, _id: { $ne: new ObjectId(userId) } });
    if (exists) throw new ConflictError('Email already in use');
  }
  if (data.username) {
    const exists = await db.collection('users').findOne({ username: data.username, _id: { $ne: new ObjectId(userId) } });
    if (exists) throw new ConflictError('Username already in use');
  }

  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } }
  );

  return getMe(userId);
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const db = getDB();
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  if (!user) throw new NotFoundError('User not found');

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Current password is incorrect');

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { passwordHash, updatedAt: new Date() } });
}

export async function getSettings(userId: string) {
  const db = getDB();
  let settings = await db.collection('userSettings').findOne({ userId: new ObjectId(userId) });
  if (!settings) {
    const result = await db.collection('userSettings').insertOne({
      userId: new ObjectId(userId),
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
      notificationSound: true,
      theme: 'light',
    });
    settings = await db.collection('userSettings').findOne({ _id: result.insertedId });
  }
  return settings;
}

export async function updateSettings(userId: string, data: {
  workDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
  sessionsUntilLongBreak?: number;
  notificationSound?: boolean;
  theme?: string;
}) {
  const db = getDB();
  await db.collection('userSettings').updateOne(
    { userId: new ObjectId(userId) },
    { $set: data },
    { upsert: true }
  );
  return db.collection('userSettings').findOne({ userId: new ObjectId(userId) });
}
