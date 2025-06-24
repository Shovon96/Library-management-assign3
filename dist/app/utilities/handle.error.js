"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const zod_1 = require("zod");
const handleError = (res, error) => {
    let statusCode = 500;
    let message = error.message || 'Something went wrong';
    let errorData = error;
    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = error.message || 'Validation failed';
        errorData = {
            name: error.name,
            errors: error.errors,
        };
    }
    // Zod Validation Error
    else if (error instanceof zod_1.ZodError) {
        statusCode = 400;
        message = error.message || 'Validation failed';
        errorData = {
            name: 'ZodError',
            errors: error.format()
        };
    }
    // Not Found Error
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
exports.handleError = handleError;
