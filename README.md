# 🏆 Athleon — Real-Time Sports Analytics Platform

Athleon is a production-grade sports intelligence platform that provides real-time insights into athlete fatigue, match momentum, and performance analytics.

---

## 🚀 Features

* 🔥 Fatigue Prediction Engine
* 📊 Real-Time Match Analytics
* ⚡ Redis Caching (High Performance)
* 📡 Live Updates via Socket.io
* 🔐 JWT Authentication
* 🧠 Microservices Architecture

---

## 🏗️ Architecture

```
Client (Next.js / Flutter)
        ↓
API Gateway
        ↓
Microservices
   - Auth Service
   - Fatigue Service
   - EMI Service
   - Analytics API
        ↓
PostgreSQL + Redis
        ↓
Socket.io (Real-Time)
```

---

## 🛠️ Tech Stack

* Backend: Node.js, Express
* Database: PostgreSQL (Prisma ORM)
* Cache: Redis
* Real-time: Socket.io
* Auth: JWT
* DevOps: Docker, Docker Compose

---

## 📂 Project Structure

```
athleon/
│
├── backend/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── fatigue-service/
│   ├── emi-service/
│   ├── analytics-api/
│
├── frontend/
│   ├── dashboard/
│
├── mobile/
│   ├── flutter-app/
│
├── docker/
├── docs/
└── README.md
```

---

## ⚙️ Setup

```bash
git clone https://github.com/yourusername/athleon-sports-analytics.git
cd athleon-sports-analytics

docker-compose up --build
```

---

## 📡 API Endpoints

### Fatigue Service

* `POST /api/v1/fatigue/telemetry`
* `GET /api/v1/fatigue/status/:id`

---

## 🧠 Interview Explanation

Athleon is a microservices-based real-time sports analytics platform that uses an API Gateway for routing, Redis for caching, PostgreSQL for structured data, and Socket.io for live updates. It enables coaches to monitor fatigue and match momentum in real time.

---

## 📌 Status

✅ Phase-1 Day-1 Completed
🚧 Phase-1 Day-2 (API Gateway) in progress

---

## 👨‍💻 Author

Keerthi Kumar V

# Athleon: Production-Grade Sports Analytics Platform

Athleon is a performance monitoring platform for athletes, leveraging real-time telemetry and microservices architecture.

## Microservices Stack
- **Fatigue Service**: Monitors and calculates fatigue via Heart Rate, HRV, and Sleep data.
  - Node.js (Express), Prisma (PostgreSQL), IORedis (Caching), Socket.io (Streaming).

## 🚀 Getting Started

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- PostgreSQL & Redis (if running locally)

### 2. Local Installation
1. Clone the repository and move to the fatigue-service.
   ```bash
   cd backend/fatigue-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` (refer to `.env.example`).
4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

### 3. Running with Docker (Recommended)
Launch the entire system including Database and Redis:
```bash
docker-compose up --build
```

## 📡 API Endpoints (Fatigue Service)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/athletes` | Register a new athlete for monitoring. |
| `GET` | `/api/v1/athletes` | List all athletes and their latest metrics. |
| `POST` | `/api/v1/fatigue/telemetry` | Submit raw telemetry and update fatigue. |
| `GET` | `/api/v1/fatigue/status/:id` | Get current fatigue score for an athlete. |

## 🕹️ Real-time Communication (Socket.io)
Clients (Dashboards) can listen for real-time updates:
- **Event**: `fatigue_update`
- **Payload**: `{ athleteId, score, timestamp, alert }`

## 🧪 Testing Steps

### 1. Run Unit Tests
Test the core fatigue engine logic:
```bash
cd backend/fatigue-service
npm test
```

### 2. Manual API Test (Using cURL)
1. Register Athlete:
   ```bash
   curl -X POST http://localhost:4001/api/v1/athletes \
   -H "Content-Type: application/json" \
   -d '{"name": "James Rodriguez", "team": "Athleon FC"}'
   ```
2. Submit Telemetry (Requires JWT in actual production):
   ```bash
   curl -X POST http://localhost:4001/api/v1/fatigue/telemetry \
   -H "Content-Type: application/json" \
   -d '{"athleteId": "generated-uuid", "heartRate": 178, "variability": 30, "sleepScore": 45}'
   ```

## 🏗️ Folder Structure
```bash
athleon/
├── backend/
│   ├── api-gateway/      - Nginx or Node Gateway
│   ├── auth-service/     - Identity Management
│   ├── fatigue-service/  - Core Calculation & Storage
│   └── emi-service/      - Muscle Signal Processing
├── docker/
├── docs/
└── docker-compose.yml
```
