import { app } from './app.js';
import { config } from './config/index.js';
import { connectDB, prisma } from './config/db.js';
import { seedDatabase } from './prisma/seed.js';

async function startServer() {
  try {
    if (config.isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
      throw new Error('JWT_SECRET must be set to a random value of at least 32 characters in production.');
    }
    await connectDB();

    // Verify database has products; if empty, seed automatically
    const count = await prisma.product.count();
    if (count === 0) {
      console.log('⚡ Product catalog empty. Auto-seeding initial database...');
      await seedDatabase();
    } else {
      console.log(`📦 Database loaded with ${count} verified products.`);
    }

    const server = app.listen(config.port, () => {
      console.log(`\n==================================================`);
      console.log(`🚀 INFINITYHUB BACKEND SERVER RUNNING`);
      console.log(`🌐 URL: http://localhost:${config.port}`);
      console.log(`🩺 Health: http://localhost:${config.port}/api/health`);
      console.log(`🛍️ Products: http://localhost:${config.port}/api/products`);
      console.log(`🏪 Providers: http://localhost:${config.port}/api/providers`);
      console.log(`🛠️ Mode: ${config.nodeEnv.toUpperCase()} | Store Mode: ${config.storeDataMode.toUpperCase()}`);
      console.log(`==================================================\n`);
    });

    // Graceful shutdown handling
    const shutdown = async () => {
      console.log('\n🛑 Gracefully shutting down InfinityHub server...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('👋 Database disconnected. Goodbye.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('❌ Failed to start InfinityHub server:', err);
    process.exit(1);
  }
}

startServer();
