/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fuel, FuelType, PrismaClient, Product, ProductCategory, User } from "@prisma/client";
import { getProducts } from "./products";
import { NewDailySale } from "../src/types";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const productCategories = [
	{ name: "Bottle biere", description: "Biere being sold in bottles" },
	{ name: "Can biere", description: "Biere being sold in cans" },
	{
		name: "Sweet bottle drinks",
		description: "Sweet drinks being sold in bottles"
	},
	{ name: "Sweet bottle cans", description: "Sweet drinks being sold in cans" },
	{ name: "Mineral Water bottle", description: "Mineral water sold in bottle" },
	{ name: "Mineral Water sachet", description: "Mineral water sold in sachet" },
	{ name: "Tinned cans", description: "Food items in tinned cans" }
];

const createProducts = async(categories: ProductCategory[]) => {
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
						return {product_id: p.id, unit_price: p.selling_price, quantity: quantities[i]}
					})
				}
			}
		}
	});
}

export const createdUsers: User[] = []

export const fuels: Fuel[] = []

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

	return {user1, user2, user3, user4}
}

// CREATING CATEGORIES
const createCategories = async () => {
await prisma.productCategory.createMany({
	data: productCategories
});

	return await prisma.productCategory.findMany();
}

const saveDailySale = async (user: User, expextedMoneyInUser: Decimal, amountGivenUser: Decimal) => {
	
	const dailySale = {
		user_id: user.id,
		amount_sold: expextedMoneyInUser,
		amount_given: amountGivenUser,
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

		const {user1, user2, user3, user4} = await createUsers();

		const categories = await createCategories();

		const products = await createProducts(categories);

		const productSoldByUser1 = [products[0], products[1], products[3]];
		const quantitiesSoldByUser1 = [2, 1, 14];
		const productSoldByUser4 = [products[3], products[4], products[5], products[6], products[7]];
		const quantitiesSoldByUser4 = [4, 7, 2, 6, 1];

		await saveSalesForUser(user1, productSoldByUser1, quantitiesSoldByUser1);

		await saveSalesForUser(user4, productSoldByUser4, quantitiesSoldByUser4);
		
		let expextedMoneyInUser1 = new Decimal(0);
		let expextedMoneyInUser4 = new Decimal(0);
		
		for (let i = 0; i < productSoldByUser1.length; i++) {
			expextedMoneyInUser1.add(productSoldByUser1[i].selling_price.toNumber() * quantitiesSoldByUser1[i]);	
		}

		for (let i = 0; i < productSoldByUser4.length; i++) {
			expextedMoneyInUser4.add(productSoldByUser4[i].selling_price.toNumber() * quantitiesSoldByUser4[i]);	
		}

		expextedMoneyInUser1 = new Decimal(expextedMoneyInUser1);
		expextedMoneyInUser4 = new Decimal(expextedMoneyInUser4);

		let amountGivenUser1 = new Decimal(0);
		let amountGivenUser4 = new Decimal(0);

		// amount given is calculated as if the seller kept the money for 1 product
		for (let i = 0; i < productSoldByUser1.length-1; i++) {
			amountGivenUser1.add(productSoldByUser1[i].selling_price.toNumber() * quantitiesSoldByUser1[i]);	
		}

		// behave as if the seller handed in all what they sold
		for (let i = 0; i < productSoldByUser4.length; i++) {
			amountGivenUser4.add(productSoldByUser4[i].selling_price.toNumber() * quantitiesSoldByUser4[i]);	
		}

		await saveDailySale(user1, expextedMoneyInUser1, amountGivenUser1);
		await saveDailySale(user4, expextedMoneyInUser4, amountGivenUser4);

		const tank1 = await prisma.tank.create({
			data: {
				name: "Tank A",
				capacity: 40000
			}
		});

		const tank2 = await prisma.tank.create({
			data: {
				name: "Tank B",
				capacity: 15000
			}
		});

		const tank3 = await prisma.tank.create({
			data: {
				name: "Tank C",
				capacity: 15000
			}
		});

		const tank4 = await prisma.tank.create({
			data: {
				name: "Tank D",
				capacity: 0
			}
		});

		const fuel1 = await prisma.fuel.create({
			data: {
				name: "Fuel",
				fuel_type: FuelType.FUEL,
				description: "Fuel for normal petrol engines",
				purchase_price: 650,
				selling_price: 700,
				quantity_theory: 5250,
				quantity_actual: 5250,
				tank_id: tank1.id
			}
		});

		const fuel2 = await prisma.fuel.create({
			data: {
				name: "Gasoil",
				fuel_type: FuelType.GASOIL,
				description: "Fuel for Diesel engines",
				purchase_price: 600,
				selling_price: 650,
				quantity_theory: 11400,
				quantity_actual: 11400,
				tank_id: tank2.id
			}
		});

		const fuel3 = await prisma.fuel.create({
			data: {
				name: "Petrol",
				fuel_type: FuelType.PETROL,
				description: "Petrol to be burnt of traditional Lamps",
				purchase_price: 200,
				selling_price: 250,
				quantity_theory: 8700,
				quantity_actual: 8700,
				tank_id: tank3.id
			}
		});

		const fuel4 = await prisma.fuel.create({
			data: {
				name: "Gaz Bottle",
				fuel_type: FuelType.GAS_BOTTLE,
				description: "Domestic Gaz Bottle",
				purchase_price: 6500,
				selling_price: 7000,
				quantity_theory: 150,
				quantity_actual: 150,
				tank_id: tank4.id
			}
		});

		fuels.push(fuel1, fuel2, fuel3, fuel4);

		const pumps = [
			{ name: "Pump A", fuel: fuel1 },
			{ name: "Pump B", fuel: fuel2 },
			{ name: "Pump C", fuel: fuel3 },
			{ name: "Pump D", fuel: fuel1 },
			{ name: "Pump E", fuel: fuel2 },
			{ name: "Pump F", fuel: fuel3 },
			{ name: "Gaz Bottles", fuel: fuel4 },
		];

		for (const pump of pumps) {
			await prisma.pump.create({
				data: {
					name: pump.name,
					fuel: { connect: { id: pump.fuel.id } }
				}
			});
		}

		await prisma.messageNotification.create({
			data: {
				title: "For Jogn doe",
				message: "Initial message for Jogn doe",
				read: false,
				users: { connect: [{ id: user1.id }] }
			}
		});

		await prisma.messageNotification.create({
			data: {
				title: "For Neymar Junior",
				message: "Initial message Neymar Junior",
				read: false,
				users: { connect: [{ id: user2.id }] }
			}
		});

		await prisma.messageNotification.create({
			data: {
				title: "For many users",
				message: "Initial message many users",
				read: false,
				users: { connect: [{ id: user1.id }, { id: user2.id }, { id: user4.id }] }
			}
		});
	} catch (error) {
		console.error("Seeding failed: ", error);
		process.exit(1);
	} finally {
		// disconnect after the operations
		await prisma.$disconnect();
	}
}
