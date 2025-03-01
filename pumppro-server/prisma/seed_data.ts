import { FuelType, Gender, ProductCategory, Role } from "@prisma/client";

export const productCategories = [
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

export const initialUsersData = [
	{
		names: "John Doe",
		username: "johndoe",
		gender: Gender.MALE,
		phone: "237123456789",
		godfather_phone: "237253142542",
		date_of_birth: new Date(2000, 0o2, 15),
		salary: 80000,
		cni_number: "1234567890",
		email: "johndoe@gmail.com",
		password_hash:
			"$2a$12$TCL9gaFusbLlVRk.o47Z6.u13X/EmQlZFARCBC9ZOehLVo050QOje",
		role: Role.ADMIN
	},
	{
		names: "Neymar Junior",
		username: "neymarjunior",
		gender: Gender.MALE,
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
		role: Role.SALE
	},
	{
		names: "Kim Kard",
		username: "kimkard",
		gender: Gender.FEMALE,
		phone: "23798685745",
		date_of_birth: "1989-12-05T00:00:00.000Z",
		salary: 75000,
		cni_number: "1234567890",
		godfather_phone: "237253142542",
		localisation: "Ndogbong",
		email: "kimkard@hotmail.com",
		role: Role.PUMPIST
	},
	{
		names: "Mary Takam",
		username: "takammary",
		gender: Gender.FEMALE,
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
		role: Role.SALE
	}]

export const initialUnSavedProducts = (categories: ProductCategory[]) => {
	return [
		{
			name: "Mambo PM 25g",
			description: "Chocolate thin bar of 25g",
			quantity: 75,
			purchase_price: 150,
			selling_price: 175,
			low_stock_threshold: 25,
			category_id: categories[1].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262313/pumppro/products/unh7iikkkxynza1cehzh.jpg"
		},
		{
			name: "Guiness PM 30CL",
			description: "Guiness petit model",
			quantity: 110,
			purchase_price: 600,
			selling_price: 650,
			low_stock_threshold: 24,
			category_id: categories[2].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262267/pumppro/products/aqamczmtz5b87zvmbdv9.jpg"
		},
		{
			name: "Guiness GM 60CL",
			description: "Guiness Grand model",
			quantity: 130,
			purchase_price: 900,
			selling_price: 1000,
			low_stock_threshold: 35,
			category_id: categories[3].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262358/pumppro/products/cepf7d2emlrcjxstz0n9.jpg"
		},
		{
			name: "Djino Cocktail 1L",
			description: "Djino Cocktail 1 liter",
			quantity: 40,
			purchase_price: 500,
			selling_price: 600,
			low_stock_threshold: 8,
			category_id: categories[0].id
		},
		{
			name: "Jadida 450g",
			description: "Jadida 450g butter",
			quantity: 20,
			purchase_price: 400,
			selling_price: 500,
			low_stock_threshold: 5,
			category_id: categories[6].id
		},
		{
			name: "Papier Hygenique SITA",
			description: "Sita toilette roll",
			quantity: 40,
			purchase_price: 200,
			selling_price: 300,
			low_stock_threshold: 10,
			category_id: categories[5].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262428/pumppro/products/bzakglvcxaazs1pnuruv.jpg"
		},
		{
			name: "Dolait (Boite)",
			description: "Dolait boite standar",
			quantity: 60,
			purchase_price: 385,
			selling_price: 400,
			low_stock_threshold: 15,
			category_id: categories[4].id
		},
		{
			name: "Dolait 150g",
			description: "Djino Cocktail 1 liter",
			quantity: 40,
			purchase_price: 250,
			selling_price: 400,
			low_stock_threshold: 10,
			category_id: categories[3].id
		},
		{
			name: "Peak",
			description: "Peak milk",
			quantity: 40,
			purchase_price: 450,
			selling_price: 500,
			low_stock_threshold: 8,
			category_id: categories[1].id
		},
		{
			name: "Vin Rouge JOLIMET",
			description: "Vin Rouge JOLIMET",
			quantity: 10,
			purchase_price: 2166,
			selling_price: 2500,
			low_stock_threshold: 2,
			category_id: categories[2].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262517/pumppro/products/xzibxpjonv3idu0bxyej.jpg"
		},
		{
			name: "Mambo PM 25g New",
			description: "Chocolate thin bar of 25g NEW",
			quantity: 75,
			purchase_price: 150,
			selling_price: 175,
			low_stock_threshold: 25,
			category_id: categories[1].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262470/pumppro/products/ncnppmvqcn5jzpb3tj3q.png"
		},
		{
			name: "Guiness PM 30CL New",
			description: "Guiness petit model NEW",
			quantity: 110,
			purchase_price: 600,
			selling_price: 650,
			low_stock_threshold: 24,
			category_id: categories[2].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262267/pumppro/products/aqamczmtz5b87zvmbdv9.jpg"
		},
		{
			name: "Guiness GM 30CL New",
			description: "Guiness Grand model NEW",
			quantity: 130,
			purchase_price: 900,
			selling_price: 1000,
			low_stock_threshold: 35,
			category_id: categories[3].id
		},
		{
			name: "Djino Cocktail 1L New",
			description: "Djino Cocktail 1 liter NEW",
			quantity: 40,
			purchase_price: 500,
			selling_price: 600,
			low_stock_threshold: 8,
			category_id: categories[0].id
		},
		{
			name: "Jadida 450g New",
			description: "Jadida 450g butter NEW",
			quantity: 20,
			purchase_price: 400,
			selling_price: 500,
			low_stock_threshold: 5,
			category_id: categories[6].id
		},
		{
			name: "Papier Hygenique SITA New",
			description: "Sita toilette roll NEW",
			quantity: 40,
			purchase_price: 200,
			selling_price: 300,
			low_stock_threshold: 10,
			category_id: categories[5].id
		},
		{
			name: "Dolait (Boite) New",
			description: "Dolait boite standar NEW",
			quantity: 60,
			purchase_price: 385,
			selling_price: 400,
			low_stock_threshold: 15,
			category_id: categories[4].id
		},
		{
			name: "Dolait 150g New",
			description: "Djino Cocktail 1 liter NEW",
			quantity: 40,
			purchase_price: 250,
			selling_price: 400,
			low_stock_threshold: 10,
			category_id: categories[3].id
		},
		{
			name: "Peak New",
			description: "Peak milk NEW",
			quantity: 40,
			purchase_price: 450,
			selling_price: 500,
			low_stock_threshold: 8,
			category_id: categories[1].id
		},
		{
			name: "Vin Rouge JOLIMET New",
			description: "Vin Rouge JOLIMET NEW",
			quantity: 10,
			purchase_price: 2166,
			selling_price: 2500,
			low_stock_threshold: 2,
			category_id: categories[2].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262517/pumppro/products/xzibxpjonv3idu0bxyej.jpg"
		},
		{
			name: "Mambo PM 25g NEW NEW",
			description: "Chocolate thin bar of 25g NEW NEW",
			quantity: 75,
			purchase_price: 150,
			selling_price: 175,
			low_stock_threshold: 25,
			category_id: categories[1].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262470/pumppro/products/ncnppmvqcn5jzpb3tj3q.png"
		},
		{
			name: "Guiness PM 30CL NEW NEW",
			description: "Guiness petit model NEW NEW",
			quantity: 110,
			purchase_price: 600,
			selling_price: 650,
			low_stock_threshold: 24,
			category_id: categories[2].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262313/pumppro/products/unh7iikkkxynza1cehzh.jpg"
		},
		{
			name: "Guiness GM 30CL NEW NEW",
			description: "Guiness Grand model NEW NEW",
			quantity: 130,
			purchase_price: 900,
			selling_price: 1000,
			low_stock_threshold: 35,
			category_id: categories[3].id
		},
		{
			name: "Djino Cocktail 1L NEW NEW",
			description: "Djino Cocktail 1 liter NEW NEW",
			quantity: 40,
			purchase_price: 500,
			selling_price: 600,
			low_stock_threshold: 8,
			category_id: categories[0].id
		},
		{
			name: "Jadida 450g NEW NEW",
			description: "Jadida 450g butter NEW NEW",
			quantity: 20,
			purchase_price: 400,
			selling_price: 500,
			low_stock_threshold: 5,
			category_id: categories[6].id
		},
		{
			name: "Papier Hygenique SITA NEW NEW",
			description: "Sita toilette roll NEW NEW",
			quantity: 40,
			purchase_price: 200,
			selling_price: 300,
			low_stock_threshold: 10,
			category_id: categories[5].id
		},
		{
			name: "Dolait (Boite) NEW NEW",
			description: "Dolait boite standar NEW NEW",
			quantity: 60,
			purchase_price: 385,
			selling_price: 400,
			low_stock_threshold: 15,
			category_id: categories[4].id
		},
		{
			name: "Dolait 150g NEW NEW",
			description: "Djino Cocktail 1 liter NEW NEW",
			quantity: 40,
			purchase_price: 250,
			selling_price: 400,
			low_stock_threshold: 10,
			category_id: categories[3].id
		},
		{
			name: "Peak NEW NEW",
			description: "Peak milk NEW NEW",
			quantity: 40,
			purchase_price: 450,
			selling_price: 500,
			low_stock_threshold: 8,
			category_id: categories[1].id
		},
		{
			name: "Vin Rouge JOLIMET NEW NEW",
			description: "Vin Rouge JOLIMET NEW NEW",
			quantity: 10,
			purchase_price: 2166,
			selling_price: 2500,
			low_stock_threshold: 2,
			category_id: categories[2].id,
			image:
				"https://res.cloudinary.com/rickysaka/image/upload/v1704262517/pumppro/products/xzibxpjonv3idu0bxyej.jpg"
		}
	];
};

export const tanksToCreate = [
	{
		name: "Tank A",
		capacity: 40000
	},
	{
		name: "Tank B",
		capacity: 15000
	},
	{
		name: "Tank C",
		capacity: 15000
	},
	{
		name: "Tank D",
		capacity: 0
	}
]

export const fuelsToCreate = [
	{
		name: "Fuel",
		fuel_type: FuelType.FUEL,
		description: "Fuel for normal petrol engines",
		purchase_price: 650,
		selling_price: 700,
		quantity_theory: 5250,
		quantity_actual: 5250,
		tank_id: 0 // 0 for now as the tank don't exist yet
	},
	{
		name: "Gasoil",
		fuel_type: FuelType.GASOIL,
		description: "Fuel for Diesel engines",
		purchase_price: 600,
		selling_price: 650,
		quantity_theory: 11400,
		quantity_actual: 11400,
		tank_id: 0 // 0 for now as the tank don't exist yet
	},
	{
		name: "Petrol",
		fuel_type: FuelType.PETROL,
		description: "Petrol to be burnt of traditional Lamps",
		purchase_price: 200,
		selling_price: 250,
		quantity_theory: 8700,
		quantity_actual: 8700,
		tank_id: 0 // 0 for now as the tank don't exist yet
	},
	{
		name: "Gaz Bottle",
		fuel_type: FuelType.GAS_BOTTLE,
		description: "Domestic Gaz Bottle",
		purchase_price: 6500,
		selling_price: 7000,
		quantity_theory: 150,
		quantity_actual: 150,
		tank_id: 0 // 0 for now as the tank don't exist yet
	}
]

export const initialMessageNotifications = [
	{
		title: "For Jogn doe",
		message: "Initial message for Jogn doe",
		read: false,
		users: [0]
	},
	{
		title: "For Neymar Junior",
		message: "Initial message Neymar Junior",
		read: false,
		users: [1]
	},
	{
		title: "For many users",
		message: "Initial message many users",
		read: false,
		users: [0, 1, 3]
	}
]