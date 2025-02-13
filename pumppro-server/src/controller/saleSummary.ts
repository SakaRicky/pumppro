import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { SaleDetailWithProduct } from "../types";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

interface RequestQuery {
	startDate: string | undefined;
	selectedCategoryID: string | undefined;
	stopDate: string | undefined;
	userID: string | undefined;
}

const productWithCategory = Prisma.validator<Prisma.ProductDefaultArgs >()({
	include: { category: true }
});

export type ProductWithCategory = Prisma.ProductGetPayload<
	typeof productWithCategory
>;

// Assuming SaleDetailWithProduct is your type for sale details that includes the related product
export interface SaleDetailComputed extends SaleDetailWithProduct {
	total_amount: Decimal;
  }

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
			sale_details: {
				select: {
					id: true,
					sale: true,
					sale_id: true,
					product: true,
					product_id: true,
					unit_price: true,
					quantity: true,
					created_at: true,
					updated_at: true
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
		.map(sale => sale.sale_details)
		.flat()
		.filter(detail =>
			productsInThisCategory
				.map(product => product.id)
				.includes(detail.product.id)
		);
	
	const saleDetailsWithComputedTotal: SaleDetailComputed[] = allSalesDetailsForThisCategory.map(detail => ({
			...detail,
			total_amount: detail.unit_price.mul(detail.quantity) // Using Decimal's multiplication
		  }));

	// accumulate the sale details (this is for products sold) and get an overall
	const accumulatedSoldProductSaleDetails =
	saleDetailsWithComputedTotal.reduce(
			(acc: SaleDetailComputed[], curr) => {
				const found = acc.find(item => item.product_id === curr.product.id);
				if (found) {
					found.total_amount = found.unit_price.mul(found.quantity);
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
		totalAmountSoldForThisPeriodInThisCategory += detail.total_amount.toNumber();
		benefitsForThisPeriodInThisCategory +=
			detail.total_amount.toNumber() - detail.product.purchase_price.toNumber() * detail.quantity;
		allProductSaleDetails.push({
			id: detail.product_id,
			name: detail.product.name,
			image: detail.product.image,
			quantity_in_stock: detail.product.quantity,
			purchase_price: detail.product.purchase_price,
			selling_price: detail.product.selling_price,
			amount: detail.total_amount.toNumber(),
			number_sold: detail.quantity
		});
	}

	// I use this to calculate total amount sold in this timeframe for all products
	const allSalesAllCategories = await getAllSales(where);

	let totalAmountSoldAllCategories = 0;

	for (const sale of allSalesAllCategories) {
		totalAmountSoldAllCategories += sale.sale_details.map(s => s.quantity * s.unit_price.toNumber()).reduce((acc, val) => acc + val, 0);
	}

	return res.send({
		salesSummary: allProductSaleDetails,
		totalAmountSoldForThisPeriodInThisCategory,
		totalAmountSoldAllCategories,
		benefitsForThisPeriodInThisCategory
	});
};
