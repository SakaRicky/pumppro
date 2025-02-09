import supertest from "supertest";
import prisma from "../../client";
import app from "../app";

const api = supertest(app);

let token: string;

describe.only("Test the users route", () => {
	beforeEach(async () => {
		console.log("Before all users-test");
		await prisma.user.createMany({
			data: [
				{
					names: "John Doe Test",
					username: "johndoetest",
					gender: "MALE",
					phone: "123456789",
					godfather_phone: "253142542",
					date_of_birth: new Date(2000, 0o2, 15),
					salary: 80000,
					email: "johndoe@gmail.com",
					CNI_number: "0024585",
					password_hash:
						"$2a$12$TCL9gaFusbLlVRk.o47Z6.u13X/EmQlZFARCBC9ZOehLVo050QOje",
					role: "ADMIN"
				},
				{
					names: "Neymar Test",
					username: "neymartest",
					gender: "MALE",
					phone: "213452642",
					date_of_birth: "1995-09-25T00:00:00.000Z",
					salary: 85000,
					godfather_phone: "253142542",
					localisation: "Yassa",
					CNI_number: "0024585",
					password_hash:
						"$2a$12$TCL9gaFusbLlVRk.o47Z6.u13X/EmQlZFARCBC9ZOehLVo050QOje",
					profile_picture:
						"https://images.unsplash.com/photo-1596077058573-d3d8281a190f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
					role: "SALE"
				}
			]
		});

		const res = await api
			.post("/auth")
			.send({ username: "johndoetest", password: "12345678" });
		token = res.body.token as string;
	});

	afterEach(async () => {
		console.log("After all");

		const deleteSales = prisma.sale.deleteMany();
		const deleteSaleDetails = prisma.saleDetail.deleteMany();
		const deleteProducts = prisma.product.deleteMany();
		const deleteusers = prisma.user.deleteMany();
		const deletedailySales = prisma.dailySale.deleteMany();
		const deleteProductsCategory = prisma.productCategory.deleteMany();

		await prisma.$transaction([
			deleteSales,
			deleteSaleDetails,
			deleteProducts, 
			deleteusers,
			deletedailySales,
			deleteProductsCategory
		]);

		await prisma.$disconnect();
	});

	describe("CRUD operation by ADMIN", () => {
		it("should create a new user when posted by admin", async () => {
			const res = await api
				.post("/users")
				.field("names", "New John User")
				.field("username", "newjohnuser")
				.field("gender", "MALE")
				.field("phone", "123456789")
				.field("godfather_phone", "123456789")
				.field("date_of_birth", new Date(2000, 0o2, 15).toISOString())
				.field("salary", "80000")
				.field("email", "newjohndoe@gmail.com")
				.field("password", "12345678")
				.field("role", "USER")
				.field("CNI_number", "12345678")
				.set({
					authorization: `bearer ${token}`
				});

			expect(res.status).toBe(200);
			const users = await prisma.user.findMany();
			expect(users.length).toBe(3);
		});

		it("should return users when token is given", async () => {
			const res = await api.get("/users").set({
				authorization: `bearer ${token}`
			});
			const users = JSON.parse(res.text) as any[];

			expect(res.status).toBe(200);
			expect(users.length).toBe(2);
		});

		it("should update existing user", async () => {
			const user = await prisma.user.findUnique({
				where: { username: "johndoetest" }
			});
			if (user) {
				const res = await api
					.put("/users")
					.field("id", user.id)
					.field("names", user.names + " Edited")
					.field("username", user.username + "edited")
					.field("gender", user.gender)
					.field("phone", user.phone)
					.field("godfather_phone", user.godfather_phone || "")
					.field("date_of_birth", user.date_of_birth.toISOString())
					.field("salary", "90000")
					.field("email", user.email || "")
					.field("password", "12345678")
					.field("role", user.role)
					.field("CNI_number", user.CNI_number || "")
					.set({
						authorization: `bearer ${token}`
					});

				expect(res.status).toBe(200);
				const users = await prisma.user.findMany();
				expect(users.length).toBe(2);
				const editedUser = prisma.user.findUnique({
					where: { username: user.username + "edited" }
				});
				expect(editedUser).toBeDefined();
			}
		});

		it("should delete existing user", async () => {
			const user = await prisma.user.findUnique({
				where: { username: "neymartest" }
			});
			if (user) {
				const res = await api
					.delete("/users")
					.send({ id: user.id })
					.set({
						authorization: `bearer ${token}`
					});

				expect(res.status).toBe(200);
				const users = await prisma.user.findMany();
				expect(users.length).toBe(1);
			}
		});
	});

	describe("CRUD from non admin", () => {
		beforeEach(async () => {
			const res = await api
				.post("/auth")
				.send({ username: "neymartest", password: "12345678" });
			token = res.body.token as string;
		});
		it("shouldn't create a new user when posted by non ADMIN", async () => {
			const res = await api
				.post("/users")
				.field("names", "New John User")
				.field("username", "newjohnuser")
				.field("gender", "MALE")
				.field("phone", "123456789")
				.field("godfather_phone", "123456789")
				.field("date_of_birth", new Date(2000, 0o2, 15).toISOString())
				.field("salary", "80000")
				.field("email", "newjohndoe@gmail.com")
				.field("password", "12345678")
				.field("role", "USER")
				.field("CNI_number", "12345678")
				.set({
					authorization: `bearer ${token}`
				});

			expect(res.status).toBe(401);
			const users = await prisma.user.findMany();
			expect(users.length).toBe(2);
		});

		it("should return users when token is given", async () => {
			const res = await api.get("/users").set({
				authorization: `bearer ${token}`
			});
			const users = JSON.parse(res.text) as any[];

			expect(res.status).toBe(200);
			expect(users.length).toBe(2);
		});

		it("shouldn't update existing user", async () => {
			const user = await prisma.user.findUnique({
				where: { username: "johndoetest" }
			});
			if (user) {
				const res = await api
					.put("/users")
					.field("id", user.id)
					.field("names", user.names + " Edited")
					.field("username", user.username + "edited")
					.field("gender", user.gender)
					.field("phone", user.phone)
					.field("godfather_phone", user.godfather_phone || "")
					.field("date_of_birth", user.date_of_birth.toISOString())
					.field("salary", "90000")
					.field("email", user.email || "")
					.field("password", "12345678")
					.field("role", user.role)
					.field("CNI_number", user.CNI_number || "")
					.set({
						authorization: `bearer ${token}`
					});

				expect(res.status).toBe(401);
				const users = await prisma.user.findMany();
				expect(users.length).toBe(2);
				const editedUser = await prisma.user.findUnique({
					where: { username: user.username + "edited" }
				});
				expect(editedUser).toBeNull();
			}
		});

		it("shouldn't delete existing user", async () => {
			const user = await prisma.user.findUnique({
				where: { username: "neymartest" }
			});
			if (user) {
				const res = await api
					.delete("/users")
					.send({ id: user.id })
					.set({
						authorization: `bearer ${token}`
					});

				expect(res.status).toBe(401);
				const users = await prisma.user.findMany();
				expect(users.length).toBe(2);
			}
		});
	});

	describe("When no token is given", () => {
		it("shouldn't return users if no token is given", async () => {
			const res = await api.get("/users");

			expect(res.status).toBe(401);
			expect(res.text).toContain("token missing or invalid");
		});
	});
	// it("should fail and return 401 when given either wrong username or password", async () => {
	// 	const res = await api
	// 		.post("/auth")
	// 		.send({ username: "johndoe", password: "validpassword" });

	// 	expect(res.status).toBe(401);
	// 	expect(res.text).toContain("invalid username or password");
	// });

	// it("should return a JWT token when providing valid credentials", async () => {
	// 	const res = await api
	// 		.post("/auth")
	// 		.send({ username: "johndoetest", password: "12345678" });

	// 	expect(res.status).toBe(200);
	// 	expect(res.body).toHaveProperty("token");
	// });
});
