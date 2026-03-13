import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import * as controller from './statistics.controller';

const router = Router();

router.use(authenticate);

router.get('/summary', controller.getSummary as any);
router.get('/weekly', controller.getWeeklyActivity as any);
router.get('/xp-history', controller.getXpHistory as any);

export default router;
