import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import groceryRoutes from './routes/groceryRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import visualSearchRoutes from './routes/visualSearchRoutes.js';
import sharedListRoutes from './routes/sharedListRoutes.js';
import providerRoutes from './routes/providerRoutes.js';

export const app = express();

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-guest-id'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// API Route Registration
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/search/visual', visualSearchRoutes);
app.use('/api/shared-lists', sharedListRoutes);
app.use('/api/providers', providerRoutes);

// Catch-all 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route "${req.method} ${req.originalUrl.split('?')[0]}" not found.`,
  });
});

// Centralized error handling
app.use(errorHandler);
