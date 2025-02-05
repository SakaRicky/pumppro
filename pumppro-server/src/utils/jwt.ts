import config from "./config";
import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export interface DecodedTokenType extends jwt.JwtPayload {
	id: string;
	role: string;
	username: string;
}

export const createJWTToken = (user: User) => {
	const userForToken = {
		username: user.username,
		role: user.role,
		id: user.id
	};

	// token expires in 60*60 seconds, that is, in one hour
	const token = jwt.sign(userForToken, config.JWT_SECRET, {
		expiresIn: 24 * 60 * 60
	});
	return token;
};

export const verifyToken = (token: string) => {
	const decodedToken = jwt.verify(
		token || "",
		config.JWT_SECRET
	) as DecodedTokenType;

	return decodedToken;
};
