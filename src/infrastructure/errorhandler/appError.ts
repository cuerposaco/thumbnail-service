export class AppError extends Error {
  statusCode: number;
  data: unknown;
  stack?: string | undefined;

  constructor(statusCode: number, message: string, data?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
