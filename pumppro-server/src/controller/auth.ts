import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { LogginUser } from "../types";
import bcrypt from "bcrypt";
import { createJWTToken, verifyToken } from "../utils/jwt";
import { RequestWithToken } from "../utils/middleware";

const prisma = new PrismaClient();

export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const body = req.body as LogginUser;
		const user = await prisma.user.findUnique({
			where: { username: body.username },
			include: {
				messages: true
			}
		});

		const allowedRoles = ["ADMIN", "SALE"];
		if (user && !allowedRoles.includes(user.role)) {
			return res.status(401).json({
				error: "You are not allowed to use this platform"
			});
		}

		const passwordCorrect =
			user === null
				? false
				: await bcrypt.compare(
						body.password,
						(user.password_hash as string) || ""
				  );

		// If there is no user and no password, auth fail and return message to indicate that
		if (!(user && passwordCorrect)) {
			return res.status(401).json({
				error: "invalid username or password"
			});
		}

		const token = createJWTToken(user);
		return res.status(200).send({
			id: user?.id,
			username: user.username,
			role: user.role,
			profilePicture: user.profile_picture,
			token: token,
			messages: user.messages
		});
	} catch (error) {
		next(error);
	}
};

export const verifyUser = async (
	req: RequestWithToken,
	res: Response,
	next: NextFunction
) => {
	const token = req.token;

	try {
		const decodedToken = verifyToken(token || "");
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
