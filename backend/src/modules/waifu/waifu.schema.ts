import { z } from 'zod';

export const interactSchema = z.object({
  event: z.enum(['SESSION_COMPLETED', 'TASK_COMPLETED', 'STREAK_BROKEN', 'DAILY_LOGIN']),
});
