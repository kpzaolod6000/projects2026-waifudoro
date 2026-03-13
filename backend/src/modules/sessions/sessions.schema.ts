import { z } from 'zod';

export const createSessionSchema = z.object({
  type: z.enum(['WORK', 'SHORT_BREAK', 'LONG_BREAK']),
  durationMin: z.number().int().min(1).max(120),
  taskId: z.string().optional(),
});

export type CreateSessionDto = z.infer<typeof createSessionSchema>;
