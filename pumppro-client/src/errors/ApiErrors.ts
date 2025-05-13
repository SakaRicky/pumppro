import { AppError } from "./appError";

export class BadRequestError extends AppError {
  constructor(params: { message: string; originalError?: any }) {
    super({ ...params, name: "BadRequestError", statusCode: 400 });
  }
}

export class AuthError extends AppError {
  constructor(params: { message: string; originalError?: any }) {
    super({ ...params, name: "AuthError", statusCode: 401 });
  }
}

export class ForbiddenError extends AppError {
  constructor(params: { message: string; originalError?: any }) {
    super({ ...params, name: "ForbiddenError", statusCode: 403 });
  }
}

export class NotFoundError extends AppError {
  constructor(params: { message: string; originalError?: any }) {
    super({ ...params, name: "NotFoundError", statusCode: 404 });
  }
}

export class ServerError extends AppError {
  // For 5xx errors
  constructor(params: { message: string; originalError?: any }) {
    super({ ...params, name: "ServerError", statusCode: 500 }); // Or can be flexible
  }
}

export class ConnectionError extends AppError {
  constructor(params: { message: string; originalError?: any }) {
    super({ ...params, name: "ConnectionError" }); // No HTTP status code
  }
}

// src/errors/ValidationErrors.ts (Example if you have structured validation errors)
export interface FieldError {
  field: string;
  message: string;
}
export class ValidationError extends AppError {
  public readonly errors: FieldError[];
  constructor(params: {
    message: string;
    errors: FieldError[];
    originalError?: any;
  }) {
    super({ ...params, name: "ValidationError", statusCode: 422 }); // Or 400
    this.errors = params.errors;
  }
}
