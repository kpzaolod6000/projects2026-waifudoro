import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createSessionSchema } from './sessions.schema';
import * as controller from './sessions.controller';

const router = Router();

// Public: optionally attaches user if token provided
router.get('/timer/config', (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    authenticate(req, res, () => controller.getTimerConfig(req, res, next));
  } else {
    controller.getTimerConfig(req, res, next);
  }
});

router.use(authenticate);
router.post('/', validate(createSessionSchema), controller.recordSession as any);
router.get('/', controller.listSessions as any);

export default router;
