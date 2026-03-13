import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as statsService from './statistics.service';
import { ok } from '../../utils/response';

export async function getSummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const summary = await statsService.getSummary(req.user.id);
    ok(res, summary);
  } catch (err) { next(err); }
}

export async function getWeeklyActivity(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await statsService.getWeeklyActivity(req.user.id);
    ok(res, data);
  } catch (err) { next(err); }
}

export async function getXpHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await statsService.getXpHistory(req.user.id);
    ok(res, data);
  } catch (err) { next(err); }
}
