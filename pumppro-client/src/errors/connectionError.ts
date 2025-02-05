import { ErrorBase } from "./errorBase";

type ConnectionErrorName = "Connection_Error";

export class ConnectionError extends ErrorBase<ConnectionErrorName> {}
