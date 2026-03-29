// d:\PROJECT\Athleon\backend\fatigue-service\src\routes\fatigue.routes.js

import { Router } from 'express';
import FatigueController from '../controllers/fatigue.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Route: POST /api/v1/fatigue/telemetry
 * Description: Submit real-time athlete metrics to recalculate fatigue score.
 * Body: { athleteId, heartRate, variability, sleepScore }
 */
router.post('/telemetry', authenticate, FatigueController.submitAthleteTelemetry);

/**
 * Route: GET /api/v1/fatigue/status/:athleteId
 * Description: Retrieve current fatigue status.
 */
router.get('/status/:athleteId', authenticate, FatigueController.getAthleteStatus);

export default router;
