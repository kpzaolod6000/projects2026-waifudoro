import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { ok, created } from '../../utils/response';

const COOKIE_NAME = 'refreshToken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.body);
    const { accessToken, refreshToken, user } = await authService.register(req.body);
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    created(res, { accessToken, user });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { accessToken, refreshToken, user, leveledUp } = await authService.login(req.body);
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    ok(res, { accessToken, user, leveledUp });
  } catch (err) { next(err); }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) { res.status(401).json({ error: 'No refresh token' }); return; }
    const { accessToken } = await authService.refresh(token);
    ok(res, { accessToken });
  } catch (err) { next(err); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (token) await authService.logout(token);
    res.clearCookie(COOKIE_NAME);
    res.status(204).send();
  } catch (err) { next(err); }
}
