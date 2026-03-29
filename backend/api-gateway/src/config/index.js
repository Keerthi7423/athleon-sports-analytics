import dotenv from 'dotenv';
dotenv.config();

/**
 * Service Configuration for the API Gateway
 */
export const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'athleon-default-secret',
  
  // Advanced Gateway Optimization
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // 100 requests per window
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS || '*'
    }
  },

  timeouts: {
    service: 5000 // 5 seconds
  },

  // Microservice Proxy Endpoints
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    },
    fatigue: {
      url: process.env.FATIGUE_SERVICE_URL || 'http://localhost:5002',
    },
    emi: {
      url: process.env.EMI_SERVICE_URL || 'http://localhost:5003',
    }
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  }
};
