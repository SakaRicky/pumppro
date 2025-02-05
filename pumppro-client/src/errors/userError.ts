import { ErrorBase } from "./errorBase";

type UserErrorName = "USER_ERROR";

export class UserError extends ErrorBase<UserErrorName> {}
