import { getDB, ObjectId } from '../../config/db';

const WAIFU_REPLIES = [
  "Gambatte, Onii-chan! I believe in you! 💪",
  "That's the spirit! Let's keep going and level up together! 🌸",
  "Sugoi! You're doing amazing today! Don't stop now!",
  "I'm always here cheering for you, Onii-chan! Ganbatte! 🎉",
  "Every small step gets you closer to your goal! You can do it!",
  "Hai hai! Let's make this session count! I believe in you! ⭐",
  "You've worked so hard today — I'm really proud of you! 😊",
];

function generateReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('tired') || lower.includes('exhausted'))
    return "It's okay to feel tired, Onii-chan! Take a short break and come back refreshed. I'll be waiting! 💕";
  if (lower.includes('give up') || lower.includes('quit'))
    return "Don't give up! Every champion felt like quitting — but they didn't. You won't either! 🔥";
  if (lower.includes('done') || lower.includes('finished') || lower.includes('complete'))
    return "Yatta! Mission cleared! You did it, Onii-chan! 🎊 Ready for the next one?";
  if (lower.includes('help'))
    return "Of course! I'm always here to help, Onii-chan! What do you need? 🌟";
  return WAIFU_REPLIES[Math.floor(Math.random() * WAIFU_REPLIES.length)];
}

export async function getChatHistory(userId: string, limit = 50) {
  const db = getDB();
  const messages = await db.collection('chatMessages')
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: 1 })
    .limit(limit)
    .toArray();
  return messages.map(m => ({ ...m, id: m._id.toString(), _id: undefined }));
}

export async function sendMessage(userId: string, message: string) {
  const db = getDB();
  const oid = new ObjectId(userId);
  const now = new Date();

  const [userRes, waifuRes] = await Promise.all([
    db.collection('chatMessages').insertOne({ userId: oid, isUser: true, message, createdAt: now }),
    db.collection('chatMessages').insertOne({ userId: oid, isUser: false, message: generateReply(message), createdAt: new Date(now.getTime() + 1) }),
  ]);

  return {
    userMessage: { id: userRes.insertedId.toString(), isUser: true, message, createdAt: now },
    waifuReply: { id: waifuRes.insertedId.toString(), isUser: false, message: generateReply(message), createdAt: new Date(now.getTime() + 1) },
  };
}

export async function clearHistory(userId: string) {
  const db = getDB();
  await db.collection('chatMessages').deleteMany({ userId: new ObjectId(userId) });
}
