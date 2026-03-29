// d:\PROJECT\Athleon\backend\fatigue-service\src\config\db.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export { prisma };
