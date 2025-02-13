/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fuel, FuelType, PrismaClient, Product, ProductCategory, Tank, User } from "@prisma/client";
import { fuelsToCreate, getProducts, initialMessageNotifications, productCategories, tanksToCreate } from "./seed_data";
import { NewDailySale } from "../src/types";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const createProducts = async (categories: ProductCategory[]) => {
	await prisma.product.createMany({ data: getProducts(categories) });

	return await prisma.product.findMany();
}

export const products = async () => {
	return await prisma.product.findMany();
}

/**
 * 
 * @param user user that made the sale 
 * @param products products sold
 * @param quantities quantities for each item in the products that were sold
 */
const saveSalesForUser = async (user: User, products: Product[], quantities: number[]) => {

	await prisma.sale.create({
		data: {
			user_id: user.id,
			sale_details: {
				createMany: {
					data: products.map((p, i) => {
						return { product_id: p.id, unit_price: p.selling_price, quantity: quantities[i] }
					})
				}
			}
		}
	});
}

export const createdUsers: User[] = []

export const createdFuels: Fuel[] = []

export const initialDailySales: NewDailySale[] = []

// CREATING USERS
const createUsers = async () => {
	const user1 = await prisma.user.create({
		data: {
			names: "John Doe",
			username: "johndoe",
			gender: "MALE",
			phone: "237123456789",
			godfather_phone: "237253142542",
			date_of_birth: new Date(2000, 0o2, 15),
			salary: 80000,
			cni_number: "1234567890",
			email: "johndoe@gmail.com",
			password_hash:
				"$2a$12$TCL9gaFusbLlVRk.o47Z6.u13X/EmQlZFARCBC9ZOehLVo050QOje",
			role: "ADMIN"
		}
	});

	const user2 = await prisma.user.create({
		data: {
			names: "Neymar Junior",
			username: "neymarjunior",
			gender: "MALE",
			phone: "237213452642",
			date_of_birth: "1995-09-25T00:00:00.000Z",
			salary: 85000,
			godfather_phone: "237253142542",
			localisation: "Yassa",
			cni_number: "0024585",
			password_hash:
				"$2a$12$TCL9gaFusbLlVRk.o47Z6.u13X/EmQlZFARCBC9ZOehLVo050QOje",
			profile_picture:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704234935/pumppro/users/qgbhukpnskvikw1moqbi.avif",
			role: "SALE"
		}
	});

	const user3 = await prisma.user.create({
		data: {
			names: "Kim Kard",
			username: "kimkard",
			gender: "FEMALE",
			phone: "23798685745",
			date_of_birth: "1989-12-05T00:00:00.000Z",
			salary: 75000,
			cni_number: "1234567890",
			godfather_phone: "237253142542",
			localisation: "Ndogbong",
			email: "kimkard@hotmail.com",
			role: "PUMPIST"
		}
	});

	const user4 = await prisma.user.create({
		data: {
			names: "Mary Takam",
			username: "takammary",
			gender: "FEMALE",
			phone: "237776699885",
			salary: 70000,
			date_of_birth: new Date(2002, 0o7, 19),
			godfather_phone: "23789658965",
			localisation: "Bonaberi",
			cni_number: "13254",
			password_hash:
				"$2a$12$TCL9gaFusbLlVRk.o47Z6.u13X/EmQlZFARCBC9ZOehLVo050QOje",
			profile_picture:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704234936/pumppro/users/oiwkqxy53xjvfcpyulyz.avif",
			role: "SALE"
		}
	});

	createdUsers.push(user1, user2, user3, user4);

	return { user1, user2, user3, user4 }
}

// CREATING CATEGORIES
const createCategories = async () => {
	await prisma.productCategory.createMany({
		data: productCategories
	});

	return await prisma.productCategory.findMany();
}

const saveDailySale = async (user: User, productSoldByUser: Product[], quantitiesSoldByUser: number[]) => {

	let expextedMoneyInUser = 0;

	for (let i = 0; i < productSoldByUser.length; i++) {
		expextedMoneyInUser += (productSoldByUser[i].selling_price.toNumber() * quantitiesSoldByUser[i]);
	}

	let amountGivenUser = 0;

	// amount given is calculated as if the seller kept the money for 1 product
	for (let i = 0; i < productSoldByUser.length - 1; i++) {
		amountGivenUser += (productSoldByUser[i].selling_price.toNumber() * quantitiesSoldByUser[i]);
	}

	const dailySale = {
		user_id: user.id,
		amount_sold: new Decimal(expextedMoneyInUser),
		amount_given: new Decimal(amountGivenUser),
		date_of_sale_start: new Date("2023/04/21 07:00"),
		date_of_sale_stop: new Date("2023/04/21 17:00")
	}

	await prisma.dailySale.createMany({
		data: [
			dailySale
		]
	});

	initialDailySales.push(dailySale);
}

export const dailySaleData: {user: User, productsSold: Product[], quantitySold: number[]}[] = [];

// CREATING Tanks
const createTanks = async (): Promise<Tank[]> => {
	await prisma.tank.createMany({
		data: tanksToCreate
	});

	return await prisma.tank.findMany();
}

/**
 * 
 * @param tanks a list of tanks already in db to attached their id as FK for each fuel they carry
 * @returns list of all fuels created
 */
const createFuels = async (tanks: Tank[]): Promise<Fuel[]> => {
	
	// attache the tank id to the fuel
	for (let i = 0; i < fuelsToCreate.length; i++) {
		fuelsToCreate[i].tank_id = tanks[i].id;
	}

	await prisma.fuel.createMany({
		data: fuelsToCreate
	});

	return await prisma.fuel.findMany();
}

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

	await prisma.pump.createMany({data: pumps});

	return await prisma.pump.findMany();
}

const createInitialMessageNotification = async() => {

	await Promise.all(initialMessageNotifications.map(msg => {
		prisma.messageNotification.create({
			data: {
				title: msg.title,
				message: msg.message,
				read: msg.read,
				users: {
					connect: msg.users.filter((index) => createdUsers[index]) // Ensure index exists
							.map(u => ({id: createdUsers[u].id}))
				}
			}})
	}))

}


export async function seed() {

	console.log("Seeding to: ", process.env.DATABASE_URL);

	try {
		await prisma.$transaction([
			prisma.sale.deleteMany(),
			prisma.saleDetail.deleteMany(),
			prisma.purchase.deleteMany(),
			prisma.product.deleteMany(),
			prisma.user.deleteMany(),
			prisma.dailySale.deleteMany(),
			prisma.fuel.deleteMany(),
			prisma.tank.deleteMany(),
			prisma.productCategory.deleteMany(),
			prisma.messageNotification.deleteMany(),
			prisma.fuelCount.deleteMany()
		])

		const { user1, user2, user3, user4 } = await createUsers();

		const categories = await createCategories();

		const products = await createProducts(categories);

		dailySaleData.push(
			{user: user1, productsSold: [products[0], products[1], products[3]], quantitySold: [2, 1, 14]},
			{user: user4, productsSold: [products[3], products[4], products[5], products[6], products[7]], quantitySold: [4, 7, 2, 6, 1]}
		)

		for(const d of dailySaleData) {
			await saveSalesForUser(d.user, d.productsSold, d.quantitySold);
	
			await saveDailySale(d.user, d.productsSold, d.quantitySold);
		}

	
		const createdTanks = await createTanks();

		const fuels = await createFuels(createdTanks);

		fuels.forEach(fuel => createdFuels.push(fuel))

		await createPumps(fuels)



		await createInitialMessageNotification();
		
	} catch (error) {
		console.error("Seeding failed: ", error);
		process.exit(1);
	} finally {
		// disconnect after the operations
		await prisma.$disconnect();
	}
}
