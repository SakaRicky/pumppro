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

const productWithCategory = Prisma.validator<Prisma.ProductDefaultArgs>()({
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

export const getSalesSummary = async (
	req: Request<unknown, unknown, unknown, RequestQuery>,
	res: Response
) => {
	try {
		const { startDate, stopDate, userID, selectedCategoryID } = req.query;

		const saleWhere = createWhereObject(startDate, stopDate, userID);

		// 2. Fetch Sales ONCE with necessary relations
		const allSalesForPeriod = await prisma.sale.findMany({
			where: saleWhere,
			include: {
				sale_details: {
					include: {
						product: {
							include: {
								category: true
							}
						}
					}
				},
				// user: true // Include user if needed elsewhere
			}
		});

        // 3. Extract and Filter Sale Details by Category (if selected)
        const relevantSaleDetails = allSalesForPeriod
            .flatMap(sale => sale.sale_details)
            .filter(detail =>
                // Keep detail if no category is selected OR if the detail's product matches the category
                !selectedCategoryID || detail.product.category_id === selectedCategoryID
            );

		// 4. Aggregate Sales per Product using a Map
		const productSalesAggregates = new Map<string, {
			quantity: number;
			total_amount: Decimal;
			productData: ProductWithCategory;
		}>();

		for (const detail of relevantSaleDetails) {
			const productId = detail.product_id;
			const existing = productSalesAggregates.get(productId);
			const detailAmount = detail.unit_price.mul(detail.quantity);

			if (existing) { // update what's already in the productSalesAggregates
				existing.quantity += detail.quantity;
				existing.total_amount = existing.total_amount.add(detailAmount);
			} else { //populate the productSalesAggregates
				productSalesAggregates.set(productId, {
					quantity: detail.quantity,
					total_amount: detailAmount,
					productData: detail.product
				});
			}
		}

        // 5. Fetch All Products within the Scope (Selected Category or All)
        // This is to add for the view. View needs all products even those that wasn't sold, but put sold to 0
        const allProductsInScope = await prisma.product.findMany({
            where: selectedCategoryID
			? { category_id: selectedCategoryID } 
			: {}, // return all products if no category was provided
        });

        // 6. Merge Aggregated Data with All Products & Calculate Category Totals
        let totalAmountSoldForThisPeriodInThisCategory = new Decimal(0);
        let benefitsForThisPeriodInThisCategory = new Decimal(0);
        let totalQuantitySoldForThisPeriodInThisCategory = 0;

        const salesSummary = allProductsInScope.map(product => {
            const aggregate = productSalesAggregates.get(product.id);

            const number_sold = aggregate?.quantity ?? 0;
            const amount = aggregate?.total_amount ?? new Decimal(0);

            // --- Profit Calculation ---
            const currentPurchasePrice = product.purchase_price;
            const costOfGoodsSold = currentPurchasePrice.mul(number_sold);
            const profitForItem = amount.sub(costOfGoodsSold);
            // --------------------------

            // Accumulate category totals only for items that were actually sold
            if (aggregate) {
                totalAmountSoldForThisPeriodInThisCategory = totalAmountSoldForThisPeriodInThisCategory.add(amount);
                benefitsForThisPeriodInThisCategory = benefitsForThisPeriodInThisCategory.add(profitForItem);
                totalQuantitySoldForThisPeriodInThisCategory += number_sold;
            }

            // Structure for the final report row
            return {
                id: product.id,
                name: product.name,
                image: product.image,
                quantity_in_stock: product.quantity,
                purchase_price: product.purchase_price, // Display current purchase price
                selling_price: product.selling_price,
                amount: amount.toNumber(), // Convert for JSON response
                number_sold: number_sold
            };
        });

        // 7. Calculate Grand Total Revenue (Across All Categories for the period/user)
		let totalAmountSoldAllCategories = new Decimal(0);
        // Use the already fetched details before category filtering
		allSalesForPeriod.flatMap(sale => sale.sale_details).forEach(detail => {
			totalAmountSoldAllCategories = totalAmountSoldAllCategories.add(
				detail.unit_price.mul(detail.quantity)
			);
		});

		return res.status(200).send({ 
			salesSummary: salesSummary,
			// Convert final totals for JSON response
            totalQuantitySoldForThisPeriodInThisCategory,
			totalAmountSoldForThisPeriodInThisCategory: totalAmountSoldForThisPeriodInThisCategory.toNumber(),
			totalAmountSoldAllCategories: totalAmountSoldAllCategories.toNumber(),
			benefitsForThisPeriodInThisCategory: benefitsForThisPeriodInThisCategory.toNumber()
		});

	} catch (error) {
		console.error("Error fetching sales summary:", error);
		// Send an appropriate error response
		return res.status(500).send({ message: "Failed to fetch sales summary." });
	}
};
