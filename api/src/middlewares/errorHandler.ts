import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../models/types/errorResponse';

const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message: message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
}

export default errorHandler