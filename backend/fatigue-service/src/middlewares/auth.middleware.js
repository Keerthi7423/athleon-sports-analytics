// d:\PROJECT\Athleon\backend\fatigue-service\src\middlewares\auth.middleware.js

import jwt from 'jsonwebtoken';
import { logger } from '../config/logger.js';

/**
 * JWT Authentication Middleware
 * Validates the bearer token before allowing access to the microservice.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid format.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Attach user information for subsequent microservice logic
    req.user = {
      userId: decodedToken.sub,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    logger.error('Invalid token verification attempted.', error);
    return res.status(403).json({ error: 'Session expired or invalid. Please login again.' });
  }
};

export { authenticate };
