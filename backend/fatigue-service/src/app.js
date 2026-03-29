// d:\PROJECT\Athleon\backend\fatigue-service\src\app.js

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fatigueRoutes from './routes/fatigue.routes.js';
import athleteRoutes from './routes/athlete.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

/**
 * Middleware Stack
 */
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
 */
app.use('/api/v1/fatigue', fatigueRoutes);
app.use('/api/v1/athletes', athleteRoutes);

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', microservice: 'fatigue-service' });
});

/**
 * Error Handling (Must be last)
 */
app.use(errorHandler);

export default app;
