import { getDB, ObjectId } from '../../config/db';

export type WaifuEvent = 'SESSION_COMPLETED' | 'TASK_COMPLETED' | 'STREAK_BROKEN' | 'DAILY_LOGIN';

const WAIFU_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuANoXVA0N3mXNqZV-GOmaYJkQoQ6di51K1LOTsJtmFeHebwVKo2Emo9Z5GNkeMalbOzH4vzWr2E9CeNOSTeOB9rG6ecY7bsVd07uOVtCgA4Pf-sNjhp55slwdMEoI_E8NoQKhUjV_r7g8reo1eX0EdaA4Hk2tKouAEz4oMVjVMdyAoV0vsGAW0ytygZarBJs2K8WxeFja30WS0ZMWnx6Zob7HkhWgU2KEmzHfMmRaK55tiPcxEr5YYsf4L6Gm3ZK8HZPPEJIG-0_ZLb';

const MESSAGES: Record<WaifuEvent, string[]> = {
  SESSION_COMPLETED: [
    '"You can do it, Onii-chan! Only a few minutes left. Ganbatte!"',
    '"Amazing work! You just completed another Pomodoro. I am so proud of you! 🌸"',
    '"Every session counts! Keep going, you are getting stronger every day!"',
  ],
  TASK_COMPLETED: [
    '"Mission cleared! You did it! One step closer to your goals! 🎉"',
    '"Sugoi! You finished that task! I knew you could do it, Onii-chan!"',
  ],
  STREAK_BROKEN: [
    '"Don\'t give up! Even heroes need rest. Let\'s start fresh together! 💪"',
    '"It\'s okay, Onii-chan. Tomorrow is a new day! I\'ll be here cheering for you!"',
  ],
  DAILY_LOGIN: [
    '"Ohayou! I\'ve been waiting for you! Let\'s have an amazing session today! 🌟"',
    '"You\'re here! Let\'s gain some XP together, Onii-chan!"',
  ],
};

function clamp(val: number) { return Math.max(0, Math.min(100, val)); }

function deltaFor(event: WaifuEvent) {
  switch (event) {
    case 'SESSION_COMPLETED': return { happiness: 5,   energy: -10 };
    case 'TASK_COMPLETED':    return { happiness: 10,  energy: 0   };
    case 'STREAK_BROKEN':     return { happiness: -20, energy: -10 };
    case 'DAILY_LOGIN':       return { happiness: 0,   energy: 20  };
  }
}

function pick(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export async function getWaifuStatus(userId: string) {
  const db = getDB();
  const oid = new ObjectId(userId);

  const user = await db.collection('users').findOne({ _id: oid }, { projection: { streak: 1 } });
  let waifu = await db.collection('waifuStatus').findOne({ userId: oid });

  if (!waifu) {
    const result = await db.collection('waifuStatus').insertOne({
      userId: oid, name: 'Hina', happiness: 50, energy: 100, imageUrl: WAIFU_IMAGE_URL,
    });
    waifu = await db.collection('waifuStatus').findOne({ _id: result.insertedId });
  }

  return {
    name: waifu!.name,
    happiness: waifu!.happiness,
    energy: waifu!.energy,
    streak: user?.streak ?? 0,
    message: pick(MESSAGES.DAILY_LOGIN),
    imageUrl: waifu!.imageUrl || WAIFU_IMAGE_URL,
  };
}

export async function updateWaifuStats(userId: string, event: WaifuEvent) {
  const db = getDB();
  const oid = new ObjectId(userId);
  const waifu = await db.collection('waifuStatus').findOne({ userId: oid });
  if (!waifu) return;

  const delta = deltaFor(event);
  await db.collection('waifuStatus').updateOne(
    { userId: oid },
    { $set: { happiness: clamp(waifu.happiness + delta.happiness), energy: clamp(waifu.energy + delta.energy) } }
  );
}

export async function interact(userId: string, event: WaifuEvent) {
  await updateWaifuStats(userId, event);
  const status = await getWaifuStatus(userId);
  return { ...status, message: pick(MESSAGES[event]) };
}
