// d:\PROJECT\Athleon\backend\fatigue-service\src\services\fatigue.service.js

import { prisma } from '../config/db.js';
import { redisClient } from '../config/redis.js';
import { logger } from '../config/logger.js';

const FATIGUE_THRESHOLD = 8.5;

class FatigueService {
  /**
   * Calculate current fatigue score based on historical metrics and real-time inputs
   */
  async calculateCurrentFatigue(athleteId, metrics) {
    const { heartRate, variability, sleepScore } = metrics;

    // 1. Calculate weighted Fatigue Score
    // Logic: lower sleepScore and hrv + higher heartRate = Higher Fatigue
    const hrvScore = (100 - variability) / 10; // Simple normalize
    const sleepModifier = (100 - sleepScore) / 10;
    const hrModifier = (heartRate > 150) ? 2 : 0;
    
    const rawScore = (hrvScore * 0.4) + (sleepModifier * 0.4) + (hrModifier * 0.2);
    const fatigueScore = parseFloat(Math.min(Math.max(rawScore, 0), 10).toFixed(2));

    // 2. Persist to PostgreSQL (Historical Records)
    const metricRecord = await prisma.fatigueMetric.create({
      data: {
        athleteId,
        score: fatigueScore,
        heartRate,
        variability,
        sleepScore,
      },
    });

    // 3. Cache real-time score in Redis (Expiring in 5 minutes for immediate telemetry)
    await redisClient.setex(`athlete:fatigue:${athleteId}`, 300, fatigueScore);

    // 4. Determine if alert is needed
    const needsAlert = fatigueScore >= FATIGUE_THRESHOLD;

    return {
      athleteId,
      fatigueScore,
      needsAlert,
      recordedAt: metricRecord.recordedAt,
    };
  }

  /**
   * Get cached real-time fatigue score
   */
  async getAthleteFatigue(athleteId) {
    const cached = await redisClient.get(`athlete:fatigue:${athleteId}`);
    if (cached) return parseFloat(cached);

    // If not in cache, fallback to last metrics in PG
    const lastMetric = await prisma.fatigueMetric.findFirst({
      where: { athleteId },
      orderBy: { recordedAt: 'desc' },
    });

    return lastMetric ? lastMetric.score : 0;
  }
}

export default new FatigueService();
