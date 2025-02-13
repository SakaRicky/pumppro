import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { RequestWithToken } from "../utils/middleware";
import {
	validateEditedProduct,
	validateNewProduct
} from "../utils/validateData";
import { NewProduct } from "../types";
import { uploadImage } from "../utils/uploadImage";

const prisma = new PrismaClient();

interface RequestQuery {
	categoryID: string | undefined;
}

export const getProducts = async (
	req: Request<unknown, unknown, unknown, RequestQuery>,
	res: Response
) => {
	const { categoryID } = req.query as RequestQuery;
	let where;
	if (categoryID) {
		where = {
			category_id: { equals: categoryID }
		};
	}
	const allProducts = await prisma.product.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			quantity: true,
			purchase_price: true,
			selling_price: true,
			low_stock_threshold: true,
			category: true,
			image: true,
			created_at: true,
			updated_at: true
		},
		where: where
	});

	return res.send(allProducts);
};

export const getOneProduct = async (req: Request, res: Response) => {
	const { id } = req.params;

	const productFound = await prisma.product.findUnique({
		where: {
			id: id
		},
		select: {
			id: true,
			name: true,
			description: true,
			quantity: true,
			purchase_price: true,
			selling_price: true,
			low_stock_threshold: true,
			category: true,
			image: true,
			created_at: true,
			updated_at: true
		}
	});
	return res.send(productFound);
};

export const saveProduct = async (req: RequestWithToken, res: Response) => {
	const newProduct = validateNewProduct(req.body);

	const reqFile = req.file as Express.Multer.File;
	let imageURL = "";
	if (reqFile) {
		imageURL = await uploadImage(reqFile, "products");
	}

	if (newProduct) {
		const savedProduct = await prisma.product.create({
			data: {
				name: newProduct.name,
				category_id: newProduct.category_id,
				description: newProduct.description,
				purchase_price: newProduct.purchase_price,
				quantity: newProduct.quantity,
				low_stock_threshold: newProduct.low_stock_threshold,
				selling_price: newProduct.selling_price,
				image: imageURL
			}
		});
		await prisma.purchase.create({
			data: {
				product_id: savedProduct.id,
				quantity: savedProduct.quantity
			}
		});
		return res.sendStatus(200);
	}
};

export const updateProduct = async (req: RequestWithToken, res: Response) => {
	const editedProduct = validateEditedProduct(req.body) as NewProduct & {
		id: string;
	};

	const reqFile = req.file as Express.Multer.File;
	const imageURL = req.file ? await uploadImage(reqFile, "products") : "";

	if (editedProduct) {
		await prisma.product.update({
			where: { id: editedProduct.id },
			data: {
				name: editedProduct.name,
				category_id: editedProduct.category_id,
				description: editedProduct.description,
				purchase_price: editedProduct.purchase_price,
				quantity: editedProduct.quantity,
				low_stock_threshold: editedProduct.low_stock_threshold,
				selling_price: editedProduct.selling_price,
				image: req.file ? imageURL : editedProduct.image
			}
		});
		return res.sendStatus(200);
	}
};

export const deleteProduct = async (req: RequestWithToken, res: Response) => {
	const body = req.body;
	const productIdsToDelete = body.ids;

	await prisma.product.deleteMany({
		where: {
			id: {
				in: productIdsToDelete
			}
		}
	});

	return res.sendStatus(200);
};
