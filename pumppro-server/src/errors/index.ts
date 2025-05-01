import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { MulterError } from "multer";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

export const errorHandler = (
	error: Error,
	_request: Request,
	response: Response,
	next: NextFunction
) => {
	if (error instanceof ZodError) {
		console.log(
			"error happened in ZodError with error.errors: ",
			error.message
		);
		return response.status(400).send({ error: error.message });
	}
	if (error instanceof PrismaClientKnownRequestError) {
		console.log(
			"error happened in Prisma.PrismaClientKnownRequestError with: ",
			error
		);

		return response.status(500).send({ error: "Error happened in server" });
	}

	if (error instanceof jwt.TokenExpiredError) {
		return response.status(401).send({ error: "Auth expired, Login" });
	}

	if (error instanceof MulterError) {
		console.log("🚀 ~ file: middleware.ts:96 ~ error", error);

		return response.status(400).send({ error: error.code });
	}

	if (error instanceof Error) {
		console.log(
			"file errors/index.ts line 41 Error happened with message: ",
			error.message
		);

		return response.status(400).send({ error: error.message });
	}

	// this is node way to handle exception that were not caught. It prevents the server from crashing
	process.on("uncaughtException", error => {
		console.error("There was an uncaught error", error);
		process.exit(1); // mandatory (as per the Node.js docs)
	});

	next(error);
	return null;
};
