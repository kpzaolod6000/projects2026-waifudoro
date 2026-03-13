import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { sendMessageSchema } from './chat.schema';
import * as controller from './chat.controller';

const router = Router();

router.use(authenticate);

router.get('/history', controller.getHistory as any);
router.post('/message', validate(sendMessageSchema), controller.sendMessage as any);
router.delete('/history', controller.clearHistory as any);

export default router;
