import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('Error:', err);

    res.status(500).json({
        success: false,
        message: 'An unexpected error occurred.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
}
