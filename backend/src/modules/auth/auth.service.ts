import bcrypt from 'bcryptjs';
import { getDB, ObjectId } from '../../config/db';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../utils/response';
import { updateStreak } from '../../utils/streak';
import { XP_PER_DAILY_LOGIN, applyXp } from '../../utils/xp';
import { RegisterDto, LoginDto } from './auth.schema';

const SALT_ROUNDS = 12;

function refreshTokenExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}

export async function register(dto: RegisterDto) {
  const db = getDB();

  const existing = await db.collection('users').findOne({
    $or: [{ email: dto.email }, { username: dto.username }],
  });
  if (existing) {
    throw new ConflictError(existing.email === dto.email ? 'Email already in use' : 'Username already in use');
  }

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
  const now = new Date();

  const userResult = await db.collection('users').insertOne({
    email: dto.email,
    username: dto.username,
    passwordHash,
    avatarUrl: null,
    level: 1,
    xpCurrent: 0,
    xpToNextLevel: 1000,
    totalXp: 0,
    streak: 0,
    lastActiveDate: null,
    createdAt: now,
    updatedAt: now,
  });

  const userId = userResult.insertedId;

  await db.collection('userSettings').insertOne({
    userId,
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    notificationSound: true,
    theme: 'light',
  });

  await db.collection('waifuStatus').insertOne({
    userId,
    name: 'Hina',
    happiness: 50,
    energy: 100,
    imageUrl: '',
  });

  const accessToken = signAccessToken({ sub: userId.toString(), email: dto.email });
  const refreshToken = signRefreshToken({ sub: userId.toString(), email: dto.email });

  await db.collection('refreshTokens').insertOne({
    userId,
    token: refreshToken,
    expiresAt: refreshTokenExpiresAt(),
    revoked: false,
    createdAt: now,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: userId.toString(),
      email: dto.email,
      username: dto.username,
      avatarUrl: null,
      level: 1,
      xpCurrent: 0,
      xpToNextLevel: 1000,
      totalXp: 0,
      streak: 0,
    },
  };
}

export async function login(dto: LoginDto) {
  const db = getDB();

  const user = await db.collection('users').findOne({ email: dto.email });
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const valid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid credentials');

  const { streak, lastActiveDate } = updateStreak(user.streak, user.lastActiveDate);
  const { state: xpState, leveledUp } = applyXp(
    { level: user.level, xpCurrent: user.xpCurrent, xpToNextLevel: user.xpToNextLevel, totalXp: user.totalXp },
    XP_PER_DAILY_LOGIN
  );

  await db.collection('users').updateOne(
    { _id: user._id },
    { $set: { streak, lastActiveDate, ...xpState, updatedAt: new Date() } }
  );

  const userId = user._id.toString();
  const accessToken = signAccessToken({ sub: userId, email: user.email });
  const refreshToken = signRefreshToken({ sub: userId, email: user.email });

  await db.collection('refreshTokens').insertOne({
    userId: user._id,
    token: refreshToken,
    expiresAt: refreshTokenExpiresAt(),
    revoked: false,
    createdAt: new Date(),
  });

  return {
    accessToken,
    refreshToken,
    leveledUp,
    user: {
      id: userId,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      level: xpState.level,
      xpCurrent: xpState.xpCurrent,
      xpToNextLevel: xpState.xpToNextLevel,
      totalXp: xpState.totalXp,
      streak,
    },
  };
}

export async function refresh(token: string) {
  let payload: { sub: string; email: string };
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const db = getDB();
  const stored = await db.collection('refreshTokens').findOne({ token });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token expired or revoked');
  }

  return { accessToken: signAccessToken({ sub: payload.sub, email: payload.email }) };
}

export async function logout(token: string) {
  const db = getDB();
  await db.collection('refreshTokens').updateOne({ token }, { $set: { revoked: true } });
}
