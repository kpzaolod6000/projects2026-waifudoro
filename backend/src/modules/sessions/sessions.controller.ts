import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as sessionsService from './sessions.service';
import { ok, created } from '../../utils/response';

export async function recordSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await sessionsService.recordSession(req.user.id, req.body);
    created(res, result);
  } catch (err) { next(err); }
}

export async function listSessions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const sessions = await sessionsService.listSessions(req.user.id, from, to);
    ok(res, { data: sessions });
  } catch (err) { next(err); }
}

export async function getTimerConfig(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthRequest;
    if (authReq.user?.id) {
      const config = await sessionsService.getUserTimerConfig(authReq.user.id);
      ok(res, config);
    } else {
      ok(res, sessionsService.getDefaultTimerConfig());
    }
  } catch (err) { next(err); }
}
