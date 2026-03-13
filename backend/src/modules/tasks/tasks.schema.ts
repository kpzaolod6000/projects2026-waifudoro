import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  tags: z.array(z.string().max(30)).max(5).default([]),
  estimatedPomodoros: z.number().int().min(1).max(20).default(1),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  tags: z.array(z.string().max(30)).max(5).optional(),
  estimatedPomodoros: z.number().int().min(1).max(20).optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
