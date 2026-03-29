// d:\PROJECT\Athleon\backend\fatigue-service\src\server.js

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { logger } from './config/logger.js';
import { redisClient } from './config/redis.js';
import { prisma } from './config/db.js';

const PORT = process.env.PORT || 4001;

const server = http.createServer(app);

/**
 * Socket.io Initialization
 */
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST'],
  },
});

/**
 * Global Real-time Event Handler
 * Socket.io - Athlete Real-time Stream
 */
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join_athlete_channel', (athleteId) => {
    socket.join(`athlete:${athleteId}`);
    logger.info(`Athlete ${athleteId} joined their telemetry channel.`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

/**
 * Attach Socket instance to request
 */
app.set('io', io);

/**
 * Graceful Startup
 */
async function bootstrap() {
  try {
    // 1. Connect to Database
    await prisma.$connect();
    logger.info('PostgreSQL connected via Prisma');

    // 2. Connect to Redis
    await redisClient.ping();
    logger.info('Redis connected and ready');

    // 3. Start Server
    server.listen(PORT, () => {
      logger.info(` Fatigue Microservice running on port ${PORT}`);
      logger.info(` Environment: ${process.env.NODE_ENV}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', async () => {
  logger.info('Shutting down server...');
  await prisma.$disconnect();
  await redisClient.quit();
  server.close(() => {
    process.exit(0);
  });
});

bootstrap();
