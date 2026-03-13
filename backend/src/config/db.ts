import { MongoClient, Db, ObjectId } from 'mongodb';
import { env } from './env';

let client: MongoClient;
let db: Db;

export async function connectDB(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(env.DATABASE_URL);
  await client.connect();
  db = client.db();
  console.log('✅ Connected to MongoDB');
  return db;
}

export async function disconnectDB(): Promise<void> {
  if (client) await client.close();
}

export function getDB(): Db {
  if (!db) throw new Error('Database not connected. Call connectDB() first.');
  return db;
}

export { ObjectId };
