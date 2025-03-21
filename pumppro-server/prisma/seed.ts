/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fuel, FuelSale, PrismaClient, Product, ProductCategory, Tank, User } from "@prisma/client";
import { fuelsToCreate, initialUnSavedProducts, initialMessageNotifications, productCategories, tanksToCreate, initialUsersData } from "./seed_data";
import { Decimal } from "@prisma/client/runtime/library";
import { SaleWithDetails } from "../src/types";

const prisma = new PrismaClient();

const createProducts = async (categories: ProductCategory[]) => {
	return await prisma.$transaction(async (tx) => {
		await tx.product.createMany({ data: initialUnSavedProducts(categories) });
		return await tx.product.findMany();
	});
}

// CREATING USERS
const createUsers = async (): Promise<User[]> => {
	await prisma.user.createMany({
		data: initialUsersData
	});

	return await prisma.user.findMany();
}

// CREATING CATEGORIES
const createCategories = async () => {
	await prisma.productCategory.createMany({
		data: productCategories
	});

	return await prisma.productCategory.findMany();

}

const saveProductsSale = async (user: User, products: Product[], quantities: number[]): Promise<SaleWithDetails> => {
	if (products.length !== quantities.length) {
		throw new Error('Products and quantities arrays must have the same length');
	}

	const total = new Decimal(0);
	for (let i = 0; i < products.length; i++) {
		total.add(products[i].selling_price.mul(quantities[i]));
	}

	const sale = await prisma.sale.create({
		data: {
			user_id: user.id,
			total: total,
			sale_details: {
				createMany: {
					data: products.map((p, i) => ({
						product_id: p.id,
						unit_price: p.selling_price,
						quantity: quantities[i]
					}))
				}
			}
		}
	});

	const savedSale = await prisma.sale.findUnique({ where: { id: sale.id }, select: { id: true, user_id: true, total: true, created_at: true, updated_at: true, sale_details: true } });

	if (!savedSale) {
		throw new Error(`Sale with id ${sale.id} not found`);
	}

	return savedSale
}

type FuelToSell = { user: User, fuel: Fuel, start_reading: number, end_reading: number }

const saveFuelsSale = async (fuelsToSell: FuelToSell[]): Promise<FuelSale[]> => {
	if (fuelsToSell.length === 0) {
		throw new Error('You must provide the fuels');
	}

	await prisma.fuelSale.createMany({
		data: fuelsToSell.map(f => {
			return {
				user_id: f.user.id,
				fuel_id: f.fuel.id,
				start_reading: f.start_reading,
				end_reading: f.end_reading,
				quantity_sold: f.end_reading - f.start_reading,
				total_amount: f.fuel.selling_price.mul(f.end_reading - f.start_reading)
			}
		})
	});

	return await prisma.fuelSale.findMany();

}

// @ts-ignore
const saveDailySalesSummary = async (moneyNotGiven: Decimal, productsSold?: SaleWithDetails[], fuelSold?: FuelSale[]) => { // a seller can sell both at the shop and at the pump

	// Calculate expected and given amounts
	const expectedMoneyFromSeller = productsSold?.map(s => s.sale_details).flat().reduce((acc, item) => {
		// Convert quantity to Decimal
		const quantityDecimal = new Decimal(item.quantity)
		// Multiply by unit price (a Decimal)
		const itemTotal = quantityDecimal.mul(item.unit_price)
		// Accumulate
		return acc.add(itemTotal)
	}, new Decimal(0))

	const amountGivenBySeller = expectedMoneyFromSeller!.minus(moneyNotGiven);

	// Create daily sales summary
	const dailySaleSummary = await prisma.dailySalesSummary.create({
		data: {
			user_id: productsSold![0].user_id,
			amount_sold: expectedMoneyFromSeller!,
			amount_given: amountGivenBySeller,
			date_of_sale_start: new Date("2023/04/21 07:00"),
			date_of_sale_stop: new Date("2023/04/21 17:00"),
		}
	});

	return dailySaleSummary;
};


// CREATING Tanks
const createTanks = async (): Promise<Tank[]> => {
	await prisma.tank.createMany({
		data: tanksToCreate
	});

	return await prisma.tank.findMany();
}

/**
 * @param tanks a list of tanks already in db to attached their id as FK for each fuel they carry
 * @returns list of all fuels created
 */
const createFuels = async (tanks: Tank[]): Promise<Fuel[]> => {
	if (tanks.length < fuelsToCreate.length) {
		throw new Error("Not enough tanks available for all fuels.");
	}

	const fuelsWithTanks = fuelsToCreate.map((fuel, i) => ({
		...fuel,
		tank_id: tanks[i]?.id // Assign tank ID dynamically
	}));

	await prisma.fuel.createMany({ data: fuelsWithTanks });

	return await prisma.fuel.findMany();
};

const createPumps = async (fuels: Fuel[]) => {

	if (fuels.length < 4) {
		throw new Error("Insufficient fuel data provided")
	}

	const pumps = [
		{ name: "Pump A", fuel_id: fuels[0].id },
		{ name: "Pump B", fuel_id: fuels[1].id },
		{ name: "Pump C", fuel_id: fuels[2].id },
		{ name: "Pump D", fuel_id: fuels[0].id },
		{ name: "Pump E", fuel_id: fuels[1].id },
		{ name: "Pump F", fuel_id: fuels[2].id },
		{ name: "Gaz Bottles", fuel_id: fuels[3].id },
	];

	await prisma.pump.createMany({ data: pumps });

	return await prisma.pump.findMany();
}

const createInitialMessageNotification = async (users: User[]) => {
	await Promise.all(
		initialMessageNotifications.map(msg =>
			prisma.messageNotification.create({
				data: {
					title: msg.title,
					message: msg.message,
					read: msg.read,
					users: {
						connect: msg.users
							.filter(index => users[index]) // Ensure valid user index
							.map(u => ({ id: users[u].id }))
					}
				}
			})
		)
	);
};

const createFixedCosts = async () => {
	const fixedCosts = [
		{ name: "Rent", amount: new Decimal(200000), month: 1, year: 2024 },
		{ name: "Electricity", amount: new Decimal(50000), month: 1, year: 2024 },
		{ name: "Security", amount: new Decimal(30000), month: 1, year: 2024 },
		{ name: "Salaries", amount: new Decimal(500000), month: 1, year: 2024 },
	];

	await prisma.fixedCost.createMany({ data: fixedCosts });

	return await prisma.fixedCost.findMany();
};



export async function seed() {

	try {
		await prisma.$transaction([
			prisma.saleDetail.deleteMany(),
			prisma.sale.deleteMany(),
			prisma.purchase.deleteMany(),
			prisma.fuelSale.deleteMany(),
			prisma.product.deleteMany(),
			prisma.productCategory.deleteMany(),
			prisma.user.deleteMany(),
			prisma.dailySalesSummary.deleteMany(),
			prisma.fuel.deleteMany(),
			prisma.pump.deleteMany(),
			prisma.tank.deleteMany(),
			prisma.messageNotification.deleteMany(),
			prisma.fixedCost.deleteMany()])

		const createdTanks = await createTanks();

		const fuels = await createFuels(createdTanks);

		const pumps = await createPumps(fuels)

		const fixedCosts = await createFixedCosts();

		const users = await createUsers();

		await createInitialMessageNotification(users);

		const initialProductCategoriesInDB = await createCategories();

		const initialProductsInDB = await createProducts(initialProductCategoriesInDB);

		const productsToSell = [initialProductsInDB[0], initialProductsInDB[1], initialProductsInDB[3], initialProductsInDB[3], initialProductsInDB[4], initialProductsInDB[5], initialProductsInDB[6], initialProductsInDB[7]]

		const dailySaleData = [
			{ user: users[0], productsSold: productsToSell.slice(0, 3), quantitySold: [2, 1, 14], moneyNotGiven: new Decimal(0) },
			{ user: users[3], productsSold: productsToSell.slice(3), quantitySold: [4, 7, 2, 6, 1], moneyNotGiven: new Decimal(200) }]
		
		const initialProductsSold = await Promise.all(
			dailySaleData.map(d => saveProductsSale(d.user, d.productsSold, d.quantitySold))
		);

		const fuelSaleData: FuelToSell[] = [
			{ user: users[0], fuel: fuels[0], start_reading: 100, end_reading: 150},
			{ user: users[2], fuel: fuels[1], start_reading: 587, end_reading: 820},
			{ user: users[2], fuel: fuels[2], start_reading: 500, end_reading: 300}
		]

		//@ts-ignore
		const fuelSold = await saveFuelsSale(fuelSaleData)

		// Each savedSale in savedProductsSold is for a different user
		const savedDailySalesSummary = await Promise.all(
			initialProductsSold.map(s => saveDailySalesSummary(new Decimal(100), [s]))
		)


		return {
			users,
			initialProductCategoriesInDB,
			initialProductsInDB,
			initialProductsSold,
			savedDailySalesSummary,
			fuels,
			createdTanks,
			pumps,
			fixedCosts
		};

	} catch (error) {
		console.error("Seeding failed: ", error);
		process.exit(1);
	} finally {
		// disconnect after the operations
		await prisma.$disconnect();
	}
}

if (process.env.NODE_ENV !== "test") {
	seed();
}