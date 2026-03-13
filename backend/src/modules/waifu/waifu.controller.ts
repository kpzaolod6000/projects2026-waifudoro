import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as waifuService from './waifu.service';
import { ok } from '../../utils/response';

export async function getStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const status = await waifuService.getWaifuStatus(req.user.id);
    ok(res, status);
  } catch (err) { next(err); }
}

export async function interact(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await waifuService.interact(req.user.id, req.body.event);
    ok(res, result);
  } catch (err) { next(err); }
}
