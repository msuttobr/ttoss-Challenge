import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError';

const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['api-key'];
  
    if (!apiKey || apiKey !== process.env.API_KEY) {
        throw new CustomError('Forbidden', 403);
    }
  
    next();
  };

export default validateApiKey;