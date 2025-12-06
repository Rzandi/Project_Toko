import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Generic validation middleware factory
export const validate =
  (schema: yup.Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate(req.body, { abortEarly: false });
      req.body = validated;
      next();
    } catch (err: any) {
      const errors = err.inner?.reduce((acc: any, e: any) => {
        acc[e.path] = e.message;
        return acc;
      }, {}) || { _: err.message };
      res
        .status(400)
        .json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: errors,
          },
        });
    }
  };

// Global error handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("[Error]", err);

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({
        success: false,
        error: { code: "APP_ERROR", message: err.message },
      });
  }

  if (err.name === "CastError") {
    return res
      .status(400)
      .json({
        success: false,
        error: { code: "CAST_ERROR", message: "Invalid ID format" },
      });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res
      .status(409)
      .json({
        success: false,
        error: { code: "DUPLICATE_ERROR", message: `${field} already exists` },
      });
  }

  if (err.name === "ValidationError") {
    const details = Object.entries(err.errors).reduce(
      (acc: any, [key, val]: any) => {
        acc[key] = val.message;
        return acc;
      },
      {},
    );
    return res
      .status(400)
      .json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details,
        },
      });
  }

  res
    .status(500)
    .json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Internal Server Error" },
    });
};
