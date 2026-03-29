// d:\PROJECT\Athleon\backend\fatigue-service\src\config\redis.js

import Redis from 'ioredis';
import { logger } from './logger.js';

const config = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

const redisClient = new Redis(config);

redisClient.on('connect', () => {
  logger.info('Redis connection established');
});

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

export { redisClient };
