import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as usersService from './users.service';
import { ok, noContent } from '../../utils/response';
import { z } from 'zod';

const updateMeSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

const settingsSchema = z.object({
  workDuration: z.number().int().min(1).max(120).optional(),
  shortBreakDuration: z.number().int().min(1).max(60).optional(),
  longBreakDuration: z.number().int().min(1).max(60).optional(),
  sessionsUntilLongBreak: z.number().int().min(1).max(10).optional(),
  notificationSound: z.boolean().optional(),
  theme: z.enum(['light', 'dark']).optional(),
});

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await usersService.getMe(req.user.id);
    ok(res, user);
  } catch (err) { next(err); }
}

export async function updateMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = updateMeSchema.parse(req.body);
    const user = await usersService.updateMe(req.user.id, data);
    ok(res, user);
  } catch (err) { next(err); }
}

export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    await usersService.changePassword(req.user.id, currentPassword, newPassword);
    noContent(res);
  } catch (err) { next(err); }
}

export async function getSettings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const settings = await usersService.getSettings(req.user.id);
    ok(res, settings);
  } catch (err) { next(err); }
}

export async function updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = settingsSchema.parse(req.body);
    const settings = await usersService.updateSettings(req.user.id, data);
    ok(res, settings);
  } catch (err) { next(err); }
}
