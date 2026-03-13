import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as tasksService from './tasks.service';
import { ok, created, noContent } from '../../utils/response';

export async function listTasks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { completed } = req.query;
    const filter = completed === undefined ? undefined : completed === 'true';
    const tasks = await tasksService.listTasks(req.user.id, filter);
    ok(res, { data: tasks });
  } catch (err) { next(err); }
}

export async function createTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await tasksService.createTask(req.user.id, req.body);
    created(res, task);
  } catch (err) { next(err); }
}

export async function updateTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await tasksService.updateTask(req.params.id, req.user.id, req.body);
    ok(res, task);
  } catch (err) { next(err); }
}

export async function toggleTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await tasksService.toggleTask(req.params.id, req.user.id);
    ok(res, result);
  } catch (err) { next(err); }
}

export async function deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await tasksService.deleteTask(req.params.id, req.user.id);
    noContent(res);
  } catch (err) { next(err); }
}
