import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { proxies } from './proxy/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { validate, authSchema } from './middleware/validate.middleware.js';
import rateLimit from 'express-rate-limit';

const app = express();

const limiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  message: {
    status: 'error',
    code: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * 1. Global Pre-Middleware
 */
app.use(helmet()); 
app.use(cors({ origin: config.security.cors.origin }));
app.use(limiter); // Apply rate limiting to all requests
app.use(morgan(config.env === 'development' ? 'dev' : 'combined')); 
app.use(express.json()); 

/**
 * 2. Specialized Gateway Routes
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'Athleon API Gateway - Operational',
    timestamp: new Date().toISOString(),
    env: config.env,
    uptime: process.uptime()
  });
});

/**
 * 3. Service Reverse Proxy Forwarding
 * 
 * Elite Strategy: Validate known routes BEFORE forwarding.
 */
// Public / Identity Management (POST /api/auth/login etc.)
// Note: Only validate POST requests for auth to avoid breaking other routes
app.use('/api/auth', (req, res, next) => {
  if (req.method === 'POST' && (req.path === '/login' || req.path === '/register')) {
    return validate(authSchema)(req, res, next);
  }
  next();
}, proxies.auth);

// Protected Analytics (Requires JWT in Authorization Header)
app.use('/api/fatigue', proxies.fatigue);
app.use('/api/emi', proxies.emi);

/**
 * 4. Error & Not Found Handlers
 */
app.use(notFoundHandler); // Catch all 404s
app.use(errorHandler);    // Catch all runtime exceptions

export default app;
