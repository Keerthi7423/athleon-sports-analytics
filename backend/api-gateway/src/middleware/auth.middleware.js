import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

/**
 * JWT Authentication Middleware
 * 
 * Verifies the presence and validity of the 'Authorization' Bearer token.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unathorized: Missing or invalid token format'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // Attach decoded user object to request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Token expired'
      });
    }

    return res.status(403).json({
      status: 'error',
      code: 403,
      message: 'Forbidden: Invalid token'
    });
  }
};
