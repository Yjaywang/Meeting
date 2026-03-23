import { Request, Response, NextFunction } from "express";

export function finalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err.stack);

  res.status(500).send({
    error: true,
    message: `server error: ${err.message}`,
  });
}

export function multerErrorHandler(
  err: Error & { code?: string },
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err.stack);
  if (err.code === "LIMIT_FILE_SIZE") {
    res
      .status(400)
      .send({ error: true, message: "Upload fail! File larger than 5MB" });
  } else {
    next(err);
  }
}
