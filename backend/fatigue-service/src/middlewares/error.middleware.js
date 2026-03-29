// d:\PROJECT\Athleon\backend\fatigue-service\src\middlewares\error.middleware.js

import { logger } from '../config/logger.js';

/**
 * Standardized Error Handler for Express
 * Ensures microservice responses follow consistent JSON format in production.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[Express Error Handler] ${statusCode} - ${message} - ${req.originalUrl}`);

  return res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    },
  });
};

export { errorHandler };
