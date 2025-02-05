import { ErrorBase } from "./errorBase";

type AuthErrorName = "AUTH_ERROR";

export class AuthError extends ErrorBase<AuthErrorName> {}
