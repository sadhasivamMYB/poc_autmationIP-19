import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError, ZodIssue } from "zod";

export const validateBody = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validData = await schema.parseAsync(req.body);
            req.body = validData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: "Validation Failed",
                    errors: error.issues.map((err: ZodIssue) => ({
                        field: err.path.join("."),
                        message: err.message
                    }))
                });
                return;
            }
            next(error);
        }
    };
};

export const validateQuery = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validData = req.query;
            req.query = validData;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: "Validation Failed",
                    errors: error.issues.map((err: ZodIssue) => ({
                        field: err.path.join("."),
                        message: err.message
                    }))
                });
                return;
            }
            next(error);
        }
    };
};

export const validateParams = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validData = req.params;
            req.params = validData as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: "Validation Failed",
                    errors: error.issues.map((err: ZodIssue) => ({
                        field: err.path.join("."),
                        message: err.message
                    }))
                });
                return;
            }
            next(error);
        }
    };
};

export const validateFile = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "File is required",
                });
            }
            await schema.parseAsync(req.file);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: "Validation Failed",
                    errors: error.issues.map((err: ZodIssue) => ({
                        field: err.path.join("."),
                        message: err.message
                    }))
                });
                return;
            }
            next(error);
        }
    };
};
