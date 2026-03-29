// d:\PROJECT\Athleon\backend\fatigue-service\src\controllers\athlete.controller.js

import { prisma } from '../config/db.js';
import { logger } from '../config/logger.js';

class AthleteController {
  /**
   * Register a new athlete for monitoring
   */
  async registerAthlete(req, res, next) {
    try {
      const { name, team } = req.body;
      const athlete = await prisma.athlete.create({
        data: { name, team },
      });

      return res.status(201).json({ success: true, athlete });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all athletes currently monitored by this service
   */
  async listAthletes(req, res, next) {
    try {
      const athletes = await prisma.athlete.findMany({
        include: {
          metrics: {
            take: 1,
            orderBy: { recordedAt: 'desc' },
          },
        },
      });

      return res.status(200).json({ success: true, count: athletes.length, athletes });
    } catch (error) {
      next(error);
    }
  }
}

export default new AthleteController();
