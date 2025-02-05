// import prisma from "./client";

// beforeAll(async () => {
// 	// create users
// 	console.log("Before all");

// 	await prisma.user.createMany({
// 		data: [
// 			{
// 				names: "John Doe Test",
// 				username: "johndoetest",
// 				gender: "MALE",
// 				phone: "1234567",
// 				date_of_birth: new Date(2000, 0o2, 15),
// 				salary: 80000,
// 				email: "johndoe@gmail.com",
// 				password_hash:
// 					"$2a$12$TCL9gaFusbLlVRk.o47Z6.u13X/EmQlZFARCBC9ZOehLVo050QOje",
// 				role: "ADMIN"
// 			},
// 			{
// 				names: "Neymar Test",
// 				username: "neymartest",
// 				gender: "MALE",
// 				phone: "213452642",
// 				date_of_birth: "1995-09-25T00:00:00.000Z",
// 				salary: 85000,
// 				godfather_phone: "253142542",
// 				localisation: "Yassa",
// 				CNI_number: "0024585",
// 				password_hash:
// 					"$2a$12$TCL9gaFusbLlVRk.o47Z6.u13X/EmQlZFARCBC9ZOehLVo050QOje",
// 				profile_picture:
// 					"https://images.unsplash.com/photo-1596077058573-d3d8281a190f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
// 				role: "SALE"
// 			}
// 		]
// 	});

// 	console.log("✨ 2 users successfully created!");
// });

// afterAll(async () => {
// 	console.log("After all");

// 	const deleteSales = prisma.sale.deleteMany();
// 	const deleteSaleDetails = prisma.saleDetail.deleteMany();
// 	const deleteProducts = prisma.product.deleteMany();
// 	const deleteusers = prisma.user.deleteMany();
// 	const deletedailySales = prisma.dailySale.deleteMany();
// 	const deletePetrolSales = prisma.petrolSale.deleteMany();
// 	const deleteProductsCategory = prisma.productCategory.deleteMany();

// 	await prisma.$transaction([
// 		deleteSales,
// 		deleteSaleDetails,
// 		deleteProducts,
// 		deleteusers,
// 		deletedailySales,
// 		deletePetrolSales,
// 		deleteProductsCategory
// 	]);

// 	await prisma.$disconnect();
// });
