import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { RequestWithToken } from "../utils/middleware";
import { validateEditedUser, validateNewUser } from "../utils/validateData";
import { NewUser } from "../types";
import { uploadImage } from "../utils/uploadImage";

const prisma = new PrismaClient();

interface RequestQuery {
	role: Role | undefined;
}

interface UserFilterCriteria {
	role: {
		in: Role[];
	};
}

export const getUsers = async (
	req: Request<unknown, unknown, unknown, RequestQuery>,
	res: Response
) => {
	const { role } = req.query;

	const where: UserFilterCriteria | object = role
		? {
				role: {
					in: [role, Role.ADMIN]
				}
		  }
		: {};

	const allUsers = await prisma.user.findMany({
		select: {
			id: true,
			names: true,
			username: true,
			date_of_birth: true,
			email: true,
			phone: true,
			gender: true,
			godfather_phone: true,
			salary: true,
			profile_picture: true,
			role: true,
			cni_number: true,
			localisation: true,
			created_at: true
		},
		where: where
	});
	return res.send(allUsers);
};

export const getOneUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	const foundUser = await prisma.user.findFirst({
		where: {
			id: id
		},
		select: {
			id: true,
			names: true,
			username: true,
			email: true,
			phone: true,
			gender: true,
			godfather_phone: true,
			salary: true,
			profile_picture: true,
			role: true,
			created_at: true
		}
	});
	return res.send(foundUser);
};

export const saveUser = async (req: RequestWithToken, res: Response) => {
	const newUser = validateNewUser(req.body);

	const imageURL = req.file ? await uploadImage(req.file, "users") : "";

	if (newUser) {
		const saltRounds = 10;
		let password_hash = "";
		if (newUser?.password) {
			password_hash = await bcrypt.hash(newUser?.password, saltRounds);
		}
		const createdUser = await prisma.user.create({
			data: {
				username: newUser.username,
				names: newUser.names,
				email: newUser.email,
				date_of_birth: newUser.date_of_birth,
				gender: newUser.gender,
				phone: newUser.phone,
				salary: newUser.salary,
				godfather_phone: newUser.godfather_phone,
				localisation: newUser.localisation,
				cni_number: newUser.cni_number,
				password_hash: password_hash,
				role: newUser.role,
				profile_picture: imageURL
			}
		});
		return res.status(200).send(createdUser);
	}
};

export const updateUser = async (req: RequestWithToken, res: Response) => {
	const editedUser = validateEditedUser(req.body) as NewUser & { id: string };

	const existingUser = await prisma.user.findUnique({
		where: { id: editedUser.id }
	});

	if (editedUser) {
		const saltRounds = 10;
		let password_hash = "";

		const imageURL = req.file
			? await uploadImage(req.file, "users")
			: existingUser?.profile_picture;

		if (editedUser?.password) {
			password_hash = await bcrypt.hash(editedUser?.password, saltRounds);
		}

		await prisma.user.update({
			where: { id: editedUser.id },
			data: {
				username: editedUser.username,
				names: editedUser.names,
				email: editedUser.email,
				date_of_birth: editedUser.date_of_birth,
				gender: editedUser.gender,
				phone: editedUser.phone,
				salary: editedUser.salary,
				godfather_phone: editedUser.godfather_phone,
				localisation: editedUser.localisation,
				cni_number: editedUser.cni_number,
				password_hash: password_hash
					? password_hash
					: existingUser?.password_hash,
				role: editedUser.role,
				profile_picture: imageURL
			}
		});
		return res.sendStatus(200);
	}
};

export const deleteUser = async (
	req: Request<unknown, unknown, { id: string }>,
	res: Response
) => {
	const body = req.body;
	const userIdToDelete = body.id;
	await prisma.user.delete({ where: { id: userIdToDelete } });

	return res.sendStatus(200);
};
