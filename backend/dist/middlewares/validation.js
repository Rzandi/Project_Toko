"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.validate = exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
// Generic validation middleware factory
const validate = (schema) => async (req, res, next) => {
    try {
        const validated = await schema.validate(req.body, { abortEarly: false });
        req.body = validated;
        next();
    }
    catch (err) {
        const errors = err.inner?.reduce((acc, e) => {
            acc[e.path] = e.message;
            return acc;
        }, {}) || { _: err.message };
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: errors } });
    }
};
exports.validate = validate;
// Global error handler
const errorHandler = (err, req, res, next) => {
    console.error('[Error]', err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, error: { code: 'APP_ERROR', message: err.message } });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, error: { code: 'CAST_ERROR', message: 'Invalid ID format' } });
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({ success: false, error: { code: 'DUPLICATE_ERROR', message: `${field} already exists` } });
    }
    if (err.name === 'ValidationError') {
        const details = Object.entries(err.errors).reduce((acc, [key, val]) => {
            acc[key] = val.message;
            return acc;
        }, {});
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details } });
    }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } });
};
exports.errorHandler = errorHandler;
