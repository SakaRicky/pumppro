import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface RequestQuery {
	userID: string;
}

export const getMessageNotifications = async (
	req: Request<unknown, unknown, unknown, RequestQuery>,
	res: Response
) => {
	const { userID } = req.query as RequestQuery;

	if (userID) {
		const user = await prisma.user.findUnique({
			where: { id: userID },
			select: { messages: true }
		});

		return res.send(user?.messages);
	}
};

export const updateMessageNotification = async (
	req: Request,
	res: Response
) => {
	const body = req.body as unknown as { id: number };

	const message = await prisma.messageNotification.findUnique({
		where: { id: body.id }
	});

	if (!message) {
		throw new Error("This message don't exist anymore");
	}

	await prisma.messageNotification.update({
		where: { id: body.id },
		data: {
			read: true
		}
	});

	return res.sendStatus(200);
};
