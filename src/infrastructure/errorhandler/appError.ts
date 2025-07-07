export class AppError extends Error {
  statusCode: number;
  data: Record<string, unknown> | undefined;
  stack?: string | undefined;

  constructor(
    statusCode: number,
    message: string,
    data?: Record<string, unknown> | undefined,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
