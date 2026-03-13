import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import * as controller from './users.controller';

const router = Router();

router.use(authenticate);

router.get('/me', controller.getMe as any);
router.patch('/me', controller.updateMe as any);
router.patch('/me/password', controller.changePassword as any);
router.get('/me/settings', controller.getSettings as any);
router.patch('/me/settings', controller.updateSettings as any);

export default router;
