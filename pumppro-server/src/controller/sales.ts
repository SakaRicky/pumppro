import { Prisma, PrismaClient, Product } from "@prisma/client";
import { Request, Response } from "express";
import { RequestWithToken } from "../utils/middleware";
import { validateNewSale } from "../utils/validateData";
import { NewSaleDetail, NewSaleDetails } from "../types";
import { verifyToken } from "../utils/jwt";
import { createNotificationForAdmins } from "./utils/notification";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

interface RequestQuery {
	startDate: string | undefined;
	selectedCategoryID: string | undefined;
	stopDate: string | undefined;
	userID: string | undefined;
}

export interface SaleFilterCriteria {
	created_at?: {
		gte: Date;
		lte: Date;
	};
	user_id?: string;
}

export const getAllSalesForUser = async (
	req: Request<unknown, unknown, unknown, RequestQuery>,
	res: Response
) => {
	const { userID } = req.query;

	const user = await prisma.user.findUnique({
		where: {
			id: userID
		}
	});

	const sales = await prisma.sale.findMany({
		select: {
			id: true,
			total: true,
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
				}
			},
			created_at: true
		},
		where: user?.role === "ADMIN" ? {} : { user_id: userID },
		orderBy: {
			created_at: "desc"
		}
	});

	return res.send(sales);
};

export const getSales = async (
	req: Request<unknown, unknown, unknown, RequestQuery>,
	res: Response
) => {
	const { startDate, stopDate, userID, selectedCategoryID } = req.query;

	let where: SaleFilterCriteria = {};

	if (startDate && stopDate) {
		where = {
			...where,
			created_at: {
				gte: new Date(startDate),
				lte: new Date(stopDate)
			}
		};
	}

	if (userID !== "") {
		where = {
			...where,
			user_id: userID
		};
	}

	const allSaless = await prisma.sale.findMany({
		select: {
			id: true,
			total: true,
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
				where: selectedCategoryID
					? { product: { category_id: selectedCategoryID } }
					: {}
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

export const getOneSale = async (req: Request, res: Response) => {
	const { id } = req.params;

	const saleFound = await prisma.sale.findUnique({
		where: {
			id: Number(id)
		},
		select: {
			id: true,
			user: true,
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
				}
			},
			total: true,
			created_at: true,
			updated_at: true
		}
	});

	return res.send(saleFound);
};

export const saveSale = async (req: RequestWithToken, res: Response) => {
	const newSale = validateNewSale(req.body);

	if (!newSale) {
		throw new Error("Now Sale to be save");
	}
	const userToken = req.token;
	const decodedToken = verifyToken(userToken ?? "");
	const sale_details: NewSaleDetails[] = [];

	const seller = await prisma.user.findUnique({
		where: { id: newSale.user_id }
	});

	if (!seller) {
		throw new Error(`No seller was provided or invalid seller id`);
	}

	if (newSale.sale_details.length <= 0 || newSale.sale_details == null) {
		throw new Error(`No sale item was provided`);
	}

	const createdSale = await prisma.$transaction(async tx => {
		// make sure we have enough to sell
		for (const detail of newSale.sale_details) {
			const product = await tx.product.findUnique({
				where: { id: detail.product_id }
			});

			// make sure the product exist and there are enough products
			if (!product || detail.quantity <= 0) {
				throw new Error(`Invalid product or quantity for: ${product?.name}`);
			}
			if (product.quantity < detail.quantity) {
				throw new Error(`Insufficient stock for product: ${product.name}`);
			}

			await updateProductQuantityInDB(tx, product, detail.quantity);

			sale_details.push({
				product_id: product.id,
				unit_price: product.selling_price,
				quantity: detail.quantity
			});
		}

		const totalMoneyForSale = calculateTotalAmountSold(sale_details);

		return await tx.sale.create({
			data: {
				user_id: decodedToken.id,
				total: totalMoneyForSale,
				sale_details: {
					createMany: {
						data: sale_details
					}
				}
			}
		});
	});

	return res.status(200).send(createdSale);
};

export const updateSale = (req: RequestWithToken, res: Response) => {
	// const editedProduct = validateEditedProduct(req.body) as NewProduct & {
	// 	id: string;
	// };
	console.log("req.body: ", req.body);

	return res.sendStatus(200);
};

export const deleteSale = async (
	req: Request<unknown, unknown, { ids: string[] }>,
	res: Response
) => {
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

const calculateTotalAmountSold = (saleDetails: NewSaleDetails[]) => {
	const total = saleDetails.reduce(
		(acc: Decimal, curr: NewSaleDetail) =>
			acc.add(curr.unit_price.mul(curr.quantity)),
		new Decimal(0)
	);

	return total;
};

const updateProductQuantityInDB = async (
	tx: Prisma.TransactionClient,
	product: Product,
	quantity: number
) => {
	const updatedProduct = await tx.product.update({
		where: {
			id: product.id
		},
		data: { ...product, quantity: product.quantity - quantity }
	});

	if (updatedProduct.quantity <= product.low_stock_threshold) {
		await createNotificationForAdmins(updatedProduct);
	}
};
