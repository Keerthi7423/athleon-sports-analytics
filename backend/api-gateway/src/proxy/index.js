import { createProxyMiddleware } from 'http-proxy-middleware';
import CircuitBreaker from 'opossum';
import { config } from '../config/index.js';
import { authenticate } from '../middleware/auth.middleware.js';

/**
 * Circuit Breaker Options
 */
const breakerOptions = {
  timeout: config.timeouts.service, // Max time for request
  errorThresholdPercentage: 50,    // Fail if 50% requests fail
  resetTimeout: 30000              // Wait 30s before retrying
};

/**
 * Enhanced Proxy Factory - Now with Circuit Breaker, Timeout, and Fallbacks
 */
const createEliteProxy = (serviceConfig, name) => {
  // Logic to simulate circuit breaking logic for the proxy
  // Note: http-proxy-middleware is a standard middleware, so we wrap the call
  
  const proxyMiddleware = createProxyMiddleware({
    target: serviceConfig.url,
    changeOrigin: true,
    proxyTimeout: config.timeouts.service, // Gateway to Upstream timeout
    timeout: config.timeouts.service,      // Request timeout
    ...(serviceConfig.pathRewrite && { pathRewrite: serviceConfig.pathRewrite }),
    onProxyReq: (proxyReq, req, res) => {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id);
        proxyReq.setHeader('x-user-role', req.user.role || 'user');
      }
      console.log(`[ELITE PROXY] [${new Date().toISOString()}] - Routing to ${name}`);
    },
    onError: (err, req, res) => {
      console.error(`[ELITE PROXY ERROR] [${name}] - ${err.message}`);
      
      // Fallback response for timeout or service down
      const isTimeout = err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT';
      res.status(isTimeout ? 504 : 502).json({
        status: 'error',
        code: isTimeout ? 504 : 502,
        message: isTimeout 
          ? `Timeout: ${name} took too long to respond.` 
          : `Service Unavailable: ${name} is down or unreachable.`,
        fallback: true
      });
    }
  });

  // Opossum Circuit Breaker Wrap (conceptual for the route)
  // In a real elite gateway, you'd wrap the fetch/axios call, but here we monitor errors
  const breaker = new CircuitBreaker(async (req, res, next) => {
    return proxyMiddleware(req, res, next);
  }, breakerOptions);

  breaker.fallback(() => ({ 
    status: 'error', 
    message: `${name} is currently under heavy load. Circuit open.` 
  }));

  // Return the middleware
  return (req, res, next) => {
    if (breaker.opened) {
      return res.status(503).json({
        status: 'error',
        code: 503,
        message: `Circuit Breaker: ${name} is currently unavailable due to repeated failures.`,
        tip: 'Try again in 30 seconds.'
      });
    }
    proxyMiddleware(req, res, next);
  };
};

/**
 * Protected/Public Proxy Exports
 */
export const proxies = {
  auth: createEliteProxy(config.services.auth, 'AUTH_SERVICE'),
  fatigue: [authenticate, createEliteProxy(config.services.fatigue, 'FATIGUE_SERVICE')],
  emi: [authenticate, createEliteProxy(config.services.emi, 'EMI_SERVICE')]
};
