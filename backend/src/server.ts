import './config/env';
import app from './app';
import { connectDB, disconnectDB, getDB } from './config/db';

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

const PORT = process.env.PORT || 4000;

async function initIndexes() {
  const db = getDB();
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('userSettings').createIndex({ userId: 1 }, { unique: true });
  await db.collection('tasks').createIndex({ userId: 1 });
  await db.collection('pomodoroSessions').createIndex({ userId: 1, completedAt: -1 });
  await db.collection('waifuStatus').createIndex({ userId: 1 }, { unique: true });
  await db.collection('chatMessages').createIndex({ userId: 1, createdAt: 1 });
  await db.collection('refreshTokens').createIndex({ token: 1 }, { unique: true });
  await db.collection('refreshTokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  console.log('✅ MongoDB indexes ready');
}

async function main() {
  try {
    await connectDB();
    await initIndexes();

    app.listen(PORT, () => {
      console.log(`🚀 WaifuDoro backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    await disconnectDB();
    process.exit(1);
  }
}

main();
