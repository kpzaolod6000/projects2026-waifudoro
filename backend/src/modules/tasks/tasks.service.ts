import { getDB, ObjectId } from '../../config/db';
import { NotFoundError, ForbiddenError } from '../../utils/response';
import { applyXp, XP_PER_TASK } from '../../utils/xp';
import { updateWaifuStats } from '../waifu/waifu.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.schema';

async function assertOwnership(taskId: string, userId: string) {
  const db = getDB();
  const task = await db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
  if (!task) throw new NotFoundError('Task not found');
  if (task.userId.toString() !== userId) throw new ForbiddenError('Access denied');
  return task;
}

export async function listTasks(userId: string, completed?: boolean) {
  const db = getDB();
  const filter: Record<string, unknown> = { userId: new ObjectId(userId) };
  if (completed !== undefined) filter.completed = completed;
  const tasks = await db.collection('tasks').find(filter).sort({ createdAt: -1 }).toArray();
  return tasks.map(t => ({ ...t, id: t._id.toString(), _id: undefined }));
}

export async function createTask(userId: string, dto: CreateTaskDto) {
  const db = getDB();
  const now = new Date();
  const result = await db.collection('tasks').insertOne({
    userId: new ObjectId(userId),
    title: dto.title,
    tags: dto.tags,
    estimatedPomodoros: dto.estimatedPomodoros,
    completed: false,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  });
  return { id: result.insertedId.toString(), ...dto, completed: false, completedAt: null, createdAt: now };
}

export async function updateTask(taskId: string, userId: string, dto: UpdateTaskDto) {
  await assertOwnership(taskId, userId);
  const db = getDB();
  await db.collection('tasks').updateOne(
    { _id: new ObjectId(taskId) },
    { $set: { ...dto, updatedAt: new Date() } }
  );
  const updated = await db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
  return { ...updated, id: updated!._id.toString(), _id: undefined };
}

export async function toggleTask(taskId: string, userId: string) {
  const task = await assertOwnership(taskId, userId);
  const db = getDB();
  const completing = !task.completed;
  const now = new Date();

  await db.collection('tasks').updateOne(
    { _id: new ObjectId(taskId) },
    { $set: { completed: completing, completedAt: completing ? now : null, updatedAt: now } }
  );

  let xpResult = null;

  if (completing) {
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (user) {
      const { state, leveledUp } = applyXp(
        { level: user.level, xpCurrent: user.xpCurrent, xpToNextLevel: user.xpToNextLevel, totalXp: user.totalXp },
        XP_PER_TASK
      );
      await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { ...state, updatedAt: now } });
      await updateWaifuStats(userId, 'TASK_COMPLETED');
      xpResult = { level: state.level, xpCurrent: state.xpCurrent, xpToNextLevel: state.xpToNextLevel, leveledUp };
    }
  }

  const updated = await db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
  return { task: { ...updated, id: updated!._id.toString(), _id: undefined }, xp: xpResult };
}

export async function deleteTask(taskId: string, userId: string) {
  await assertOwnership(taskId, userId);
  const db = getDB();
  await db.collection('tasks').deleteOne({ _id: new ObjectId(taskId) });
}
