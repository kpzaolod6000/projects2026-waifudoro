import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { interactSchema } from './waifu.schema';
import * as controller from './waifu.controller';

const router = Router();

router.use(authenticate);

router.get('/status', controller.getStatus as any);
router.post('/interact', validate(interactSchema), controller.interact as any);

export default router;
