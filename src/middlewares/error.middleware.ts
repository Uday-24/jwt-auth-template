import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app-error.util.js';

export default function globalErrorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // production: operational vs programming errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({ status: err.status, message: err.message });
  }

  console.error('UNEXPECTED ERROR', err);
  res.status(500).json({ status: 'error', message: 'Something went wrong' });
}