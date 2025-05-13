interface AppErrorParams {
  name: string;
  message: string;
  statusCode?: number;
  originalError?: any;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly statusCode?: number;
  public readonly originalError?: any;

  constructor({ name, message, statusCode, originalError }: AppErrorParams) {
    super();
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
    this.originalError = originalError;

    // This is important for `instanceof` to work correctly with custom errors
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
