import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { RequestWithToken } from "../utils/middleware";
import {
	validateEditedProductCategory,
	validateNewProductCategory
} from "../utils/validateData";
import { NewProductCategory } from "../types";

const prisma = new PrismaClient();

export const getProductCategories = async (_req: Request, res: Response) => {
	const allProducts = await prisma.productCategory.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			created_at: true
		}
	});
	return res.send(allProducts);
};

export const getOneProductCategory = async (req: Request, res: Response) => {
	const { id } = req.params;

	const productFound = await prisma.productCategory.findUnique({
		where: {
			id: id
		},
		select: {
			id: true,
			name: true,
			description: true,
			created_at: true
		}
	});
	return res.send(productFound);
};

export const saveProductCategory = async (
	req: RequestWithToken,
	res: Response
) => {
	const newProductCategories = validateNewProductCategory(req.body);

	if (newProductCategories) {
		const createdCategory = await prisma.productCategory.create({
			data: {
				name: newProductCategories.name,
				description: newProductCategories.description
			}
		});
		return res.send(createdCategory);
	}
};

export const updateProductCategory = async (
	req: RequestWithToken,
	res: Response
) => {
	const editedProductCategory = validateEditedProductCategory(
		req.body
	) as NewProductCategory & {
		id: string;
	};

	if (editedProductCategory) {
		await prisma.productCategory.update({
			where: { id: editedProductCategory.id },
			data: {
				name: editedProductCategory.name,
				description: editedProductCategory.description
			}
		});
		return res.sendStatus(200);
	}
};

export const deleteProductCategory = async (
	req: Request<unknown, unknown, { id: string }>,
	res: Response
) => {
	const body = req.body;
	const productIdToDelete = body.id;
	await prisma.productCategory.delete({ where: { id: productIdToDelete } });

	return res.sendStatus(200);
};
