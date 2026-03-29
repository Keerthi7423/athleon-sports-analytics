# Multi-stage build for Node.js production microservice
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better cache utilization)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy source code and build
COPY . .
RUN npx prisma generate

# Final production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Expose microservice port
EXPOSE 4001

# Set the start command
CMD ["npm", "start"]
