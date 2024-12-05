import { ErrorResponse } from '../models/types/errorResponse';

export class CustomError extends Error implements ErrorResponse {
    public status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status;

        this.name = 'CustomError';
        Error.captureStackTrace(this, this.constructor);
    }
}