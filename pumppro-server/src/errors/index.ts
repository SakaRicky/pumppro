
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
		// Use Zod's flatten method
        const flattenedErrors = error.flatten();

        return response.status(400).json({
            error: "Validation failed. Please correct the indicated fields.",
            formErrors: flattenedErrors.formErrors, // Errors not tied to a field
            fieldErrors: flattenedErrors.fieldErrors // Errors per field
        });
	}
	if (error instanceof PrismaClientKnownRequestError) {
		console.log(
			"Error line 22 error happened in Prisma.PrismaClientKnownRequestError with: ",
			error
		);

		switch (error.code) {
			case 'P2003': {
				const fieldNameString = error.meta?.field_name; // Get the potentially non-string value

				const relatedTableMatch = typeof fieldNameString === 'string'
					? /^(.+?)_/.exec(fieldNameString)
					: null; 

				const relatedTable = relatedTableMatch ? relatedTableMatch[1] : 'related records'; // Default fallback

				const userMessage = `Cannot delete this Fuel because it is still used in ${relatedTable}. Please delete the associated ${relatedTable} entries first.`;

				return response.status(409).json({ // 409 Conflict is the appropriate status code
					error: userMessage,
				});
			}

			case 'P2025': { // Record to delete does not exist
				const modelName = error.meta?.modelName ?? 'Record';
				if (typeof modelName === "string") {
					return response.status(404).json({
						error: `${modelName} not found.`,
						// prismaCode: err.code, prismaMeta: err.meta
					});
				}
				break;
			}

			default: {
				// Handle other known Prisma errors generically
				console.error('Unhandled Prisma Known Error Code:', error.code, error.meta);
				return response.status(400).json({ // Use 400 Bad Request or 500 Internal Server Error
					error: `A database error occurred. Code: ${error.code}`, // Provide less detail in production
					// prismaCode: err.code,
					// prismaMeta: err.meta,
				});
			}

		}
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
