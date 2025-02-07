/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from "express";
import logger from "./logger";

export const requestLogger = (
	request: Request,
	_response: Response,
	next: NextFunction
) => {
	logger.info("Method: ", request.method);
	logger.info("Path: ", request.path);
	logger.info("Body: ", request.body);
	logger.info("---------");
	next();
};

export interface RequestWithToken extends Request {
	token?: string;
}

export const setHeaders = function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	// Website you wish to allow to connect
	if (req.headers.origin) {
		res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
	}

	// Request methods you wish to allow
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);

	// Request headers you wish to allow
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader("Access-Control-Allow-Credentials", "true");

	// Pass to next layer of middleware
	next();
};

export const unknownEndpoint = (
	_request: Request,
	response: Response,
	_next: NextFunction
) => {
	response.status(404).send({ error: "unknown endpoint" });
};
