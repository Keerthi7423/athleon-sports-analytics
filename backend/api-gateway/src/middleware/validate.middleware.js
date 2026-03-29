import { z } from 'zod';

/**
 * Validation Factory
 * 
 * Middleware that uses Zod to validate request body, query, or params.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Validation failed for request payload',
      errors: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }
};

/**
 * Global Common Athletic Auth Schemas
 */
export const authSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid athlete email format'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  })
});

/**
 * Generic Athlete Fatigue Data Schema for Forwarding
 */
export const fatigueSchema = z.object({
  body: z.object({
    athlete_id: z.string().uuid('Invalid athlete ID format'),
    heart_rate: z.number().min(30).max(250),
    rpe: z.number().min(0).max(10), // Rate of Perceived Exertion
  }).optional()
});
