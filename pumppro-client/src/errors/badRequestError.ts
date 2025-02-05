import { ErrorBase } from "./errorBase";

type BadRequestErrorName = "BAD_REQUEST_ERROR";

export class BadRequestError extends ErrorBase<BadRequestErrorName> {}
