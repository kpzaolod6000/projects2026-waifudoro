import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as chatService from './chat.service';
import { ok, created, noContent } from '../../utils/response';

export async function getHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const limit = Number(req.query.limit) || 50;
    const messages = await chatService.getChatHistory(req.user.id, limit);
    ok(res, { data: messages });
  } catch (err) { next(err); }
}

export async function sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await chatService.sendMessage(req.user.id, req.body.message);
    created(res, result);
  } catch (err) { next(err); }
}

export async function clearHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await chatService.clearHistory(req.user.id);
    noContent(res);
  } catch (err) { next(err); }
}
