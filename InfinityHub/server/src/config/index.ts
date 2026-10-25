import dotenv from 'dotenv';
dotenv.config();

const rawStoreMode = (process.env.STORE_DATA_MODE || 'demo').toLowerCase();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'local-development-only-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  // Only "demo" and "live" are meaningful; anything else (e.g. a legacy "mock") is treated as demo.
  storeDataMode: (rawStoreMode === 'live' ? 'live' : 'demo') as 'demo' | 'live',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  // Google retired gemini-2.0-flash on 2026-06-01; keep the model configurable so future
  // retirements are an env change instead of a code change.
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  isProduction: process.env.NODE_ENV === 'production',
};
