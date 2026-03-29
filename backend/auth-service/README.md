# Auth Service

The Identity & Access Management (IAM) microservice for Athleon.
- Responsible for User registration, login, and JWT issuance.
- Uses PostgreSQL for user credential storage (Bcrypt).
- Uses Redis for session blacklisting/revocation.
