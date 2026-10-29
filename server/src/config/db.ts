import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL/Prisma database connection established successfully.');
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    throw err;
  }
}
