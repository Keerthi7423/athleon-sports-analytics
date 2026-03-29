// d:\PROJECT\Athleon\backend\fatigue-service\src\controllers\fatigue.controller.js

import FatigueService from '../services/fatigue.service.js';
import { logger } from '../config/logger.js';

class FatigueController {
  /**
   * Post new athlete performance telemetry and calculate fatigue
   */
  async submitAthleteTelemetry(req, res, next) {
    try {
      const { athleteId, heartRate, variability, sleepScore } = req.body;

      if (!athleteId || !heartRate) {
        return res.status(400).json({ error: 'Missing required telemetry data.' });
      }

      // 1. Calculate and store fatigue
      const result = await FatigueService.calculateCurrentFatigue(athleteId, {
        heartRate,
        variability,
        sleepScore,
      });

      // 2. Real-time Push via Socket.io (Attached to app in server.js)
      const io = req.app.get('io');
      if (io) {
        io.to(`athlete:${athleteId}`).emit('fatigue_update', {
          athleteId,
          score: result.fatigueScore,
          timestamp: result.recordedAt,
          alert: result.needsAlert,
        });

        // Broadcast to Dashboard Channel for overall monitoring
        io.to('dashboard').emit('global_fatigue_telemetry', result);
      }

      // 3. Return response to API caller
      return res.status(201).json({
        success: true,
        message: 'Telemetry processed and fatigue score updated.',
        data: result,
      });

    } catch (error) {
      logger.error(`Error processing telemetry for athlete: ${req.body.athleteId}`, error);
      next(error);
    }
  }

  /**
   * Retrieve current fatigue status for an athlete
   */
  async getAthleteStatus(req, res, next) {
    try {
      const { athleteId } = req.params;
      const score = await FatigueService.getAthleteFatigue(athleteId);

      return res.status(200).json({
        athleteId,
        currentFatigueScore: score,
        status: score > 8.5 ? 'CRITICAL_FATIGUE' : 'OPTIMAL_PERFORMANCE',
      });

    } catch (error) {
      next(error);
    }
  }
}

export default new FatigueController();
