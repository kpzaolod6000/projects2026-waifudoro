import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from './tasks.schema';
import * as controller from './tasks.controller';

const router = Router();

router.use(authenticate);

router.get('/', controller.listTasks as any);
router.post('/', validate(createTaskSchema), controller.createTask as any);
router.patch('/:id', validate(updateTaskSchema), controller.updateTask as any);
router.patch('/:id/toggle', controller.toggleTask as any);
router.delete('/:id', controller.deleteTask as any);

export default router;
