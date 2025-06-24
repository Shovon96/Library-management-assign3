import { Response } from "express";
import { ZodError } from "zod";

export const handleError = (res: Response, error: any) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorData = error;

    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        errorData = {
            name: error.name,
            errors: error.errors, // contains path-wise messages
        };
    }

    // Zod Validation Error
    else if (error instanceof ZodError) {
        statusCode = 400;
        message = 'Validation failed';
        errorData = {
            name: 'ZodError',
            errors: error.format()
        };
    }

    // Not Found Error (Custom use)
    else if (error.name === 'NotFoundError') {
        statusCode = 404;
        message = error.message;
    }

    res.status(statusCode).json({
        message,
        success: false,
        error: errorData
    });
};