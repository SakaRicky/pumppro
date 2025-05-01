/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { test, describe, beforeEach } from "node:test";
import {
	authToken,
	initialProducts,
	initialProductsSoldInDB,
	initialSaleDetailsInDB,
	initialUsersInDB,
	testApi
} from "./helper/setupTestDB";
import assert from "assert";
import { getAllSales, getAllSalesDetails } from "./helper/testsHelperFunctions";
import { Decimal } from "@prisma/client/runtime/library";
import { NewSaleDetail } from "../types";

describe("Product Sales", () => {
	describe("Get products sale", () => {
		test("Should not save products sales without an auth token", async () => {
			await testApi
				.get("/daily-sales")
				.expect(401)
				.expect("Content-Type", /application\/json/);
		});

		test("Should get products sales with an auth token", async () => {
			const productsSales = await testApi
				.get("/product-sales")
				.set("Authorization", `Bearer ${authToken}`);

			assert.strictEqual(productsSales.status, 200);
			assert(productsSales.headers["content-type"], "application.json");
			assert.strictEqual(
				productsSales.body.length,
				initialProductsSoldInDB.length
			);
		});
	});

	describe("Save a new product sale", () => {
		interface SaleToSaveType {
			user_id: string;
			sale_details: NewSaleDetail[];
		}

		let saleDetailToSave: SaleToSaveType;

		beforeEach(() => {
			saleDetailToSave = {
				user_id: initialUsersInDB[0].id,
				sale_details: [
					{
						product_id: initialProducts[0].id,
						quantity: 2,
						unit_price: initialProducts[0].selling_price
					},
					{
						product_id: initialProducts[1].id,
						quantity: 3,
						unit_price: initialProducts[1].selling_price
					},
					{
						product_id: initialProducts[2].id,
						quantity: 7,
						unit_price: initialProducts[2].selling_price
					}
				]
			};
		});

		test("with a token, it saves a new product sale with multiple sale details", async () => {
			const initialTotal = saleDetailToSave.sale_details.reduce(
				(acc: Decimal, curr: NewSaleDetail) =>
					acc.add(curr.unit_price.mul(curr.quantity)),
				new Decimal(0)
			);
			const savedSales = await testApi
				.post("/product-sales")
				.send(saleDetailToSave)
				.set("Authorization", `Bearer ${authToken}`);

			const savedTotal = Number(savedSales.body.total);

			// Since in this test I save a new daily sale
			const allSales = await getAllSales();
			const allSaleDetails = await getAllSalesDetails();

			assert.strictEqual(savedSales.status, 200);
			assert(savedSales.headers["content-type"], "application.json");
			assert.strictEqual(allSales.length, initialProductsSoldInDB.length + 1);
			assert.strictEqual(savedTotal, initialTotal.toNumber());
			assert.strictEqual(
				allSaleDetails.length,
				initialSaleDetailsInDB.length + saleDetailToSave.sale_details.length
			);
		});

		test("with a token, it saves a new product sale with 1 sale detail", async () => {
			saleDetailToSave.sale_details = [
				{
					product_id: initialProducts[0].id,
					quantity: 2,
					unit_price: initialProducts[0].selling_price
				}
			];
			const initialTotal = saleDetailToSave.sale_details.reduce(
				(acc, curr) => acc.add(curr.unit_price.mul(curr.quantity)),
				new Decimal(0)
			);
			const savedSales = await testApi
				.post("/product-sales")
				.send(saleDetailToSave)
				.set("Authorization", `Bearer ${authToken}`);

			const savedTotal = Number(savedSales.body.total);

			// Since in this test I save a new daily sale
			const allSales = await getAllSales();
			const allSaleDetails = await getAllSalesDetails();

			assert.strictEqual(savedSales.status, 200);
			assert(savedSales.headers["content-type"], "application.json");
			assert.strictEqual(allSales.length, initialProductsSoldInDB.length + 1);
			assert.strictEqual(savedTotal, initialTotal.toNumber());
			assert.strictEqual(
				allSaleDetails.length,
				initialSaleDetailsInDB.length + saleDetailToSave.sale_details.length
			);
		});

		test("Should not save products sales without an auth token", async () => {
			await testApi
				.post("/daily-sales")
				.send(saleDetailToSave)
				.expect(401)
				.expect("Content-Type", /application\/json/);
		});

		test("should throw error and not save sale without a user", async () => {
			/* eslint-disable @typescript-eslint/no-unused-vars */
			const {user_id, ...saleWithoutUser } = saleDetailToSave;

			const response = await testApi
			.post("/product-sales")
			.send(saleWithoutUser)
			.set("Authorization", `Bearer ${authToken}`);
			
			// Since in this test I save a new daily sale
			const allSales = await getAllSales();
			
			assert.notStrictEqual(response.status, 200);
			assert.strictEqual(
				(response.body as { error: string }).error.includes("user_id"),
				true
			);
			assert.strictEqual(allSales.length, initialProductsSoldInDB.length);
		});

		test("should throw error and not save sale if user not in db", async () => {
			saleDetailToSave.user_id = "a_user_id";

			const response = await testApi
				.post("/product-sales")
				.send(saleDetailToSave)
				.set("Authorization", `Bearer ${authToken}`);

			// Since in this test I save a new daily sale
			const allSales = await getAllSales();

			assert.notStrictEqual(response.status, 200);
			assert.ok(
				(response.body as { error: string }).error.includes(
					"No seller was provided"
				),
				"Expected error message not found"
			);
			assert.strictEqual(allSales.length, initialProductsSoldInDB.length);
		});

		test("should throw error and not save sale if user not in db", async () => {
			saleDetailToSave.user_id = "a_user_id";

			const response = await testApi
				.post("/product-sales")
				.send(saleDetailToSave)
				.set("Authorization", `Bearer ${authToken}`);

			// Since in this test I save a new daily sale
			const allSales = await getAllSales();

			assert.notStrictEqual(response.status, 200);
			assert.ok(
				(response.body as { error: string }).error.includes(
					"No seller was provided"
				),
				"Expected error message not found"
			);
			assert.strictEqual(allSales.length, initialProductsSoldInDB.length);
		});

		test("should throw error if any product quantity is 0 or less", async () => {
			saleDetailToSave.sale_details[0].quantity = 0;

			const response = await testApi
			.post("/product-sales")
			.send(saleDetailToSave)
			.set("Authorization", `Bearer ${authToken}`);
			
			// Since in this test I save a new daily sale
			const allSales = await getAllSales();
			
			const allSaleDetails = await getAllSalesDetails();

			assert.notStrictEqual(response.status, 200);
			assert.ok(
				(response.body as { error: string }).error.includes(
					"Number must be greater than 0", 
				),
				"Expected error message not found"
			);
			assert.strictEqual(allSales.length, initialProductsSoldInDB.length);
			assert.strictEqual(allSaleDetails.length, initialSaleDetailsInDB.length);
		});

		test("should throw error if no sale details are provided", async () => {
			saleDetailToSave.sale_details = [];

			const response = await testApi
			.post("/product-sales")
			.send(saleDetailToSave)
			.set("Authorization", `Bearer ${authToken}`);
			
			// Since in this test I save a new daily sale
			const allSales = await getAllSales();
			
			const allSaleDetails = await getAllSalesDetails();

			assert.notStrictEqual(response.status, 200);
			assert.ok(
				(response.body as { error: string }).error.includes(
					"Array must contain at least 1 element(s)"
				),
				"Expected error message not found"
			);
			assert.strictEqual(allSales.length, initialProductsSoldInDB.length);
			assert.strictEqual(allSaleDetails.length, initialSaleDetailsInDB.length);
		});
	});
});
