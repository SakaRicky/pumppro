import { NextFunction, Response } from "express";
import { RequestWithToken } from "../src/utils/middleware";
import * as jwt from "jsonwebtoken";
import config from "../src/utils/config";
import { DecodedTokenType } from "../src/utils/jwt";

export const tokenExtractor = (
	req: RequestWithToken,
	res: Response,
	next: NextFunction
) => {
	const authorization = req.headers.authorization;
	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		req.token = authorization.substring(7);
		next();
	} else {
		res.status(401).json({ error: "token missing or invalid" });
	}
};

export const checkTokenExistence = (
	req: RequestWithToken,
	res: Response,
	next: NextFunction
) => {
	const token = req.token;
	const decodedToken = jwt.verify(
		token || "",
		config.JWT_SECRET
	) as DecodedTokenType;

	if (!decodedToken.id) {
		return res.status(401).json({ error: "token missing or invalid" });
	}
	next();
};

export const checkIfAdmin = (
	req: RequestWithToken,
	res: Response,
	next: NextFunction
) => {
	const token = req.token;
	const decodedToken = jwt.verify(
		token || "",
		config.JWT_SECRET
	) as DecodedTokenType;

	if (decodedToken.role !== "ADMIN") {
		return res
			.status(401)
			.json({ error: "Only admin can perform this action" });
	}
	next();
};
