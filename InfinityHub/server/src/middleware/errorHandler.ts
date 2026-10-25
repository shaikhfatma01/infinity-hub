import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

function resolveStatusAndMessage(err: any): { status: number; message: string } {
  // Request validation (zod)
  if (err instanceof ZodError) {
    return { status: 400, message: 'Validation error' };
  }

  // Known Prisma request errors -> meaningful HTTP codes
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return { status: 409, message: 'A record with these details already exists.' };
      case 'P2003':
        return { status: 400, message: 'Referenced record does not exist.' };
      case 'P2025':
        return { status: 404, message: 'Requested record was not found.' };
      default:
        break;
    }
  }

  // Multer upload errors
  if (err?.name === 'MulterError') {
    return {
      status: err.code === 'LIMIT_FILE_SIZE' ? 413 : 400,
      message:
        err.code === 'LIMIT_FILE_SIZE'
          ? 'File size exceeds maximum limit of 5 MB.'
          : `Upload error: ${err.message}`,
    };
  }

  const status = err?.status || err?.statusCode || 500;
  return { status, message: err?.message || 'An unexpected server error occurred.' };
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  const { status, message } = resolveStatusAndMessage(err);

  if (process.env.NODE_ENV !== 'test' && status >= 500) {
    console.error('💥 Unhandled Server Error:', err);
  }

  const body: Record<string, unknown> = {
    success: false,
    // Never leak internal error text for 5xx responses in production.
    error: status >= 500 && process.env.NODE_ENV === 'production' ? 'Internal server error.' : message,
  };

  if (err instanceof ZodError) {
    body.details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    // Surface the first validation message as the headline error so UIs can show it directly.
    body.error = err.errors[0]?.message || 'Validation error';
  }

  if (process.env.NODE_ENV === 'development' && status >= 500) {
    body.stack = err?.stack;
  }

  res.status(status).json(body);
}
