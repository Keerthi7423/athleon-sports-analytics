# API Gateway

Unified entry point for All Athleon Microservices.
- Routes requests to specific microservices:
  - `/api/v1/auth` -> `auth-service`
  - `/api/v1/fatigue` -> `fatigue-service`
  - `/api/v1/emi` -> `emi-service`
  - `/api/v1/analytics` -> `analytics-api`
- Implements:
  - Rate Limiting (Redis)
  - Unified CORS
  - Request Logging
  - HTTPS Termination
