// d:\PROJECT\Athleon\backend\fatigue-service\src\routes\athlete.routes.js

import { Router } from 'express';
import AthleteController from '../controllers/athlete.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Route: POST /api/v1/athletes
 * Description: Register a new athlete into the analytics platform.
 */
router.post('/', authenticate, AthleteController.registerAthlete);

/**
 * Route: GET /api/v1/athletes
 * Description: List all athletes and their latest fatigue metrics.
 */
router.get('/', authenticate, AthleteController.listAthletes);

export default router;
