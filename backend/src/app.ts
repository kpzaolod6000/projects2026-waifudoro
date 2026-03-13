import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import tasksRoutes from './modules/tasks/tasks.routes';
import sessionsRoutes from './modules/sessions/sessions.routes';
import statisticsRoutes from './modules/statistics/statistics.routes';
import waifuRoutes from './modules/waifu/waifu.routes';
import chatRoutes from './modules/chat/chat.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/waifu', waifuRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);

export default app;
