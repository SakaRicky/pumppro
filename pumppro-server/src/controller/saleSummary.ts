import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { SaleDetailWithProduct } from "../types";

const prisma = new PrismaClient();

interface RequestQuery {
	startDate: string | undefined;
	selectedCategoryID: string | undefined;
	stopDate: string | undefined;
	userID: string | undefined;
}

const productWithCategory = Prisma.validator<Prisma.ProductArgs>()({
	include: { category: true }
});

export type ProductWithCategory = Prisma.ProductGetPayload<
	typeof productWithCategory
>;

const createWhereObject = (
	startDate: string | undefined,
	stopDate: string | undefined,
	userID: string | undefined
) => {
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
	return where;
};

const createCategoryWhereObject = (selectedCategoryID: string | undefined) => {
	return selectedCategoryID
		? { product: { category_id: selectedCategoryID } }
		: {};
};

const getAllSales = async (where: {}, categoryWhere?: {}) => {
	const sales = await prisma.sale.findMany({
		select: {
			id: true,
			user: {
				select: {
					names: true,
					username: true,
					profile_picture: true
				}
			},
			total_amount: true,
			saleDetails: {
				select: {
					id: true,
					sale: true,
					sale_id: true,
					product: true,
					product_id: true,
					unit_price: true,
					quantity: true,
					total_amount: true,
					created_at: true,
					updatedAt: true
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
	return sales;
};

const getNotSoldProductSaleDetails = (
	productsInThisCategory: ProductWithCategory[],
	accumulatedSoldProductSaleDetails: SaleDetailWithProduct[]
) => {
	const notSoldProducts = productsInThisCategory.filter(
		product =>
			!accumulatedSoldProductSaleDetails
				.map(detail => detail.product_id)
				.includes(product.id)
	);

	// product not sold in this time frame, hence amount = 0 and number = 0.
	const notSoldProductSaleDetails = notSoldProducts.map(product => ({
		id: product.id,
		name: product.name,
		image: product.image,
		quantity_in_stock: product.quantity,
		purchase_price: product.purchase_price,
		selling_price: product.selling_price,
		number_sold: 0,
		amount: 0
	}));

	return notSoldProductSaleDetails;
};

// get sales for a certain period of time by a certain sales person
export const getSalesSummary = async (
	req: Request<unknown, unknown, unknown, RequestQuery>,
	res: Response
) => {
	const { startDate, stopDate, userID, selectedCategoryID } =
		req.query as RequestQuery;

	const where = createWhereObject(startDate, stopDate, userID);
	const categoryWhere = createCategoryWhereObject(selectedCategoryID);

	const allSalesForThisCategory = await getAllSales(where, categoryWhere);

	const productsInThisCategory: ProductWithCategory[] =
		await prisma.product.findMany({
			include: { category: true },
			where: { category_id: selectedCategoryID }
		});

	const allSalesDetailsForThisCategory = allSalesForThisCategory
		.map(sale => sale.saleDetails)
		.flat()
		.filter(detail =>
			productsInThisCategory
				.map(product => product.id)
				.includes(detail.product.id)
		);

	// accumulate the sale details (this is for products sold) and get an overall
	const accumulatedSoldProductSaleDetails =
		allSalesDetailsForThisCategory.reduce(
			(acc: SaleDetailWithProduct[], curr) => {
				const found = acc.find(item => item.product_id === curr.product.id);
				if (found) {
					found.total_amount += curr.total_amount;
					found.quantity += curr.quantity;
				} else {
					acc.push(curr);
				}
				return acc;
			},
			[]
		);

	// product not sold in this time frame, hence amount = 0 and number = 0.
	const notSoldProductSaleDetails = getNotSoldProductSaleDetails(
		productsInThisCategory,
		accumulatedSoldProductSaleDetails
	);

	const allProductSaleDetails = [...notSoldProductSaleDetails];

	let totalAmountSoldForThisPeriodInThisCategory = 0;
	let benefitsForThisPeriodInThisCategory = 0;

	for (const detail of accumulatedSoldProductSaleDetails) {
		totalAmountSoldForThisPeriodInThisCategory += detail.total_amount;
		benefitsForThisPeriodInThisCategory +=
			detail.total_amount - detail.product.purchase_price * detail.quantity;
		allProductSaleDetails.push({
			id: detail.product_id,
			name: detail.product.name,
			image: detail.product.image,
			quantity_in_stock: detail.product.quantity,
			purchase_price: detail.product.purchase_price,
			selling_price: detail.product.selling_price,
			amount: detail.total_amount,
			number_sold: detail.quantity
		});
	}

	// I use this to calculate total amount sold in this timeframe for all products
	const allSalesAllCategories = await getAllSales(where);

	let totalAmountSoldAllCategories = 0;

	for (const sale of allSalesAllCategories) {
		totalAmountSoldAllCategories += sale.total_amount;
	}

	return res.send({
		salesSummary: allProductSaleDetails,
		totalAmountSoldForThisPeriodInThisCategory,
		totalAmountSoldAllCategories,
		benefitsForThisPeriodInThisCategory
	});
};
