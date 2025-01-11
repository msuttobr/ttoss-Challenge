import { ErrorResponse } from '../types/errorResponse';

export class CustomError extends Error implements ErrorResponse {
    public status?: number;
    public stack?: string;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status;

        this.name = 'CustomError';
        this.stack = new Error().stack;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}