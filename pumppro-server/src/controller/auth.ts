import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedUSer, UserToAuth } from "../types";
import bcrypt from "bcrypt";
import { createJWTToken, verifyToken } from "../utils/jwt";
import { RequestWithToken } from "../utils/middleware";

const prisma = new PrismaClient();

export const findUserAndCreateAuthUser = async (
	userToAuth: UserToAuth
): Promise<AuthenticatedUSer> => {
	const user = await prisma.user.findUnique({
		where: { username: userToAuth.username },
		include: {
			messages: true
		}
	});

	const allowedRoles = ["ADMIN", "SALE"];
	if (user && !allowedRoles.includes(user.role)) {
		throw new Error("You are not allowed to use this platform");
	}

	const passwordCorrect =
		// Condition: Check if user exists AND password_hash is truthy (exists and not empty)
		user?.password_hash
			? await bcrypt.compare(userToAuth.password, user.password_hash)
			: false;

	if (!(user && passwordCorrect)) {
		throw new Error("Invalid username or password");
	}

	const token = createJWTToken(user);

	return {
		id: user?.id,
		username: user.username,
		role: user.role,
		profilePicture: user.profile_picture,
		token: token,
		messages: user.messages
	};
};

export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const body = req.body as UserToAuth;
		const authenticatedUser = await findUserAndCreateAuthUser(body);

		return res.status(200).json(authenticatedUser);
	} catch (error: unknown) {
		if (error instanceof Error) {
			if (error.message.includes("not allowed")) {
				return res.status(401).json({
					error: "You are not allowed to use this platform"
				});
			} else if (error.message.includes("invalid")) {
				return res.status(401).json({
					error: "invalid username or password"
				});
			} else {
				next(error);
			}
		}
	}
};

export const verifyUser = async (
	req: RequestWithToken,
	res: Response,
	next: NextFunction
) => {
	const token = req.token;

	try {
		const decodedToken = verifyToken(token ?? "");
		if (!decodedToken.id) {
			return res.status(401).json({ error: "token missing or invalid" });
		}
		const user = await prisma.user.findUnique({
			where: { id: decodedToken.id },
			include: {
				messages: true
			}
		});

		const authUser = {
			id: user?.id,
			username: user?.username,
			role: user?.role,
			profilePicture: user?.profile_picture,
			token: token,
			messages: user?.messages
		};
		return res.send({ user: authUser, isAuthenticated: true });
	} catch (error) {
		next(error);
	}
};
