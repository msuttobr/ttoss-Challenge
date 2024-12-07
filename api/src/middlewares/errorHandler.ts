import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/errorResponse';
import { logStream } from '../app';

const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  const stack = (err instanceof Error && err.stack) ? err.stack : '';

  const logMessage = `
    ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Status: ${statusCode} - Message: ${message} 
    ${stack && process.env.NODE_ENV === 'development' ? `\nStack: ${stack}` : ''}
  `;

  logStream.write(logMessage + '\n');

  res.status(statusCode).json({
    message: message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
}

export default errorHandler