import { config } from '../config/index.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: `Not Found - Path ${req.originalUrl} does not exist on Athleon Gateway`
  });
};

/**
 * Centralized Application Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Gateway Internal Server Error';

  console.error(`[ERROR] [${new Date().toISOString()}] - ${message}`);

  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: message,
    stack: config.env === 'development' ? err.stack : undefined
  });
};
