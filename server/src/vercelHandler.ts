import type { Request, Response } from 'express';
import { app } from './app.js';
import { config } from './config/index.js';

if (config.isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET must be set to a random value of at least 32 characters in production.');
}

if (config.isProduction && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in production.');
}

export default function vercelHandler(req: Request, res: Response) {
  const requestUrl = req.url || '/';
  if (requestUrl !== '/api' && !requestUrl.startsWith('/api/')) {
    req.url = `/api${requestUrl.startsWith('/') ? '' : '/'}${requestUrl}`;
  } else if (requestUrl === '/api') {
    req.url = '/api/';
  }

  return app(req, res);
}
