import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";

export const validate = (schema: ZodObject<any>) => {
    async function validateMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }
        }
        return res.status(500).json({ message: "Internal server error" });
    }
    return validateMiddleware;
};