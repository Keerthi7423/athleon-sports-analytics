import app from './app.js';
import { config } from './config/index.js';

/**
 * Main Application Runtime Server
 */
const startServer = () => {
  try {
    const server = app.listen(config.port, () => {
      console.log(`[SERVER] [${new Date().toISOString()}] - Athleon API Gateway started on port ${config.port}`);
      console.log(`[CONFIG] [ENV] - ${config.env}`);
    });

    /**
     * Graceful Shutdown Support for Production
     */
    process.on('SIGTERM', () => {
      console.log('[SHUTDOWN] - SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('[SHUTDOWN] - HTTP server closed.');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[CRITICAL ERROR] - Unhandled Rejection at:', promise, 'reason:', reason);
      // Let existing error handler logic take care of it or crash
    });

  } catch (error) {
    console.error(`[CRITICAL ERROR] - Gateway startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
