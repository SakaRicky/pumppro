import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { RequestWithToken } from "../utils/middleware";
import { validateNewSale } from "../utils/validateData";
import { NewSaleDetails } from "../types";
import { verifyToken } from "../utils/jwt";
import { createNotificationForAdmins } from "./utils/notification";

const prisma = new PrismaClient();

interface RequestQuery {
	startDate: string | undefined;
	selectedCategoryID: string | undefined;
	stopDate: string | undefined;
	userID: string | undefined;
}

export const getSales = async (
	req: Request<unknown, unknown, unknown, RequestQuery>,
	res: Response
) => {
	const { startDate, stopDate, userID, selectedCategoryID } =
		req.query as RequestQuery;

	let where = {};

	if (startDate && stopDate) {
		where = {
			...where,
			created_at: {
				gte: startDate,
				lte: stopDate
			}
		};
	}

	if (userID !== "") {
		where = {
			...where,
			user_id: userID
		};
	}

	let categoryWhere;
	// for sales of a particular product category
	if (selectedCategoryID) {
		categoryWhere = {
			product: {
				category_id: selectedCategoryID
			}
		};
	}

	const allSaless = await prisma.sale.findMany({
		select: {
			id: true,
			user: {
				select: {
					names: true,
					username: true,
					profile_picture: true
				}
			},
			sale_details: {
				select: {
					id: true,
					quantity: true,
					product: {
						select: {
							id: true,
							name: true,
							category: { select: { name: true } },
							image: true,
							selling_price: true
						}
					}
				},
				where: categoryWhere
			},
			created_at: true
		},
		where: where,
		orderBy: {
			created_at: "desc"
		}
	});

	return res.send(allSaless);
};

export const getOneSale = async (_req: Request, res: Response) => {
	// const { id } = req.params;

	// const productFound = await prisma.product.findUnique({
	// 	where: {
	// 		id: id
	// 	},
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		description: true,
	// 		quantity: true,
	// 		purchase_price: true,
	// 		selling_price: true,
	// 		reorder_point: true,
	// 		category: true,
	// 		image: true,
	// 		created_at: true
	// 	}
	// })
	return res.sendStatus(404);
};

export const saveSale = async (req: RequestWithToken, res: Response) => {
	const newSale = validateNewSale(req.body);
	if (!newSale) {
		throw new Error("Now Sale to be save");
	}
	const userToken = req.token;
	const decodedToken = verifyToken(userToken || "");
	const sale_details: NewSaleDetails[] = [];

	for (const saleItem of newSale) {
		const product = await prisma.product.findUnique({
			where: { id: saleItem.productID }
		});

		if (!product) {
			throw new Error(
				`No product for this sale save productID: ${saleItem.productID}`
			);
		}
		if (product.quantity < saleItem.quantity) {
			throw new Error(`Insufficient stock for product: ${product.name}`);
		}
	}

	for (const saleItem of newSale) {
		const product = await prisma.product.findUnique({
			where: { id: saleItem.productID }
		});

		if (product) {
			const updatedProduct = await prisma.product.update({
				where: {
					id: product.id
				},
				data: { ...product, quantity: product.quantity - saleItem.quantity }
			});

			if (updatedProduct.quantity <= product.low_stock_threshold) {
				await createNotificationForAdmins(updatedProduct);
			}

			sale_details.push({
				product_id: product.id,
				unit_price: product.selling_price,
				quantity: saleItem.quantity,
			});
		}
	}

	await prisma.sale.create({
		data: {
			user_id: decodedToken.id,
			sale_details: {
				createMany: {
					data: sale_details
				}
			}
		}
	});

	return res.sendStatus(200);
};

export const updateSale = async (req: RequestWithToken, res: Response) => {
	// const editedProduct = validateEditedProduct(req.body) as NewProduct & {
	// 	id: string;
	// };
	console.log("req.body: ", req.body);

	return res.sendStatus(200);
};

export const deleteSale = async (req: RequestWithToken, res: Response) => {
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
