/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { test, describe, beforeEach } from "node:test";
import {
	authToken,
	dailySaleToPost,
	initialDailySalesInDB,
	testApi
} from "./helper/setupTestDB";
import assert from "assert";
import {
	getAllDailySales,
	getDailySaleFromID,
	ZodValidationError
} from "./helper/testsHelperFunctions";
import { DailySalesSummary } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

describe("getDailysales", () => {
	test("get daily sales without an auth token", async () => {
		await testApi
			.get("/api/daily-sales")
			.expect(401)
			.expect("Content-Type", /application\/json/);
	});

	test("get daily sales with an auth token", async () => {
		const dailySales = await testApi
			.get("/api/daily-sales")
			.set("Authorization", `Bearer ${authToken}`);

		assert.strictEqual(dailySales.status, 200);
		assert(dailySales.headers["content-type"], "application.json");
		assert.strictEqual(dailySales.body.length, initialDailySalesInDB.length);
	});
});

describe("Save a new daily sale", () => {
	let allDailySales: DailySalesSummary[] = [];

	beforeEach(async () => {
		allDailySales = await getAllDailySales();
	});

	test("without a token, should not save", async () => {
		const dailySales = await testApi
			.post("/api/daily-sales")
			.send(dailySaleToPost)
			.expect(401);

		assert.strictEqual(dailySales.status, 401);
		assert(dailySales.headers["content-type"], "application.json");
	});

	test("with a token, it saves a new daily post", async () => {
		const savedDailySales = await testApi
			.post("/api/daily-sales")
			.send(dailySaleToPost)
			.set("Authorization", `Bearer ${authToken}`);

		// Since in this test I save a new daily sale
		allDailySales = await getAllDailySales();
		// console.log("🚀 ~ test ~ savedDailySales:", savedDailySales)
		assert.strictEqual(savedDailySales.status, 200);
		assert(savedDailySales.headers["content-type"], "application.json");
		assert.strictEqual(allDailySales.length, initialDailySalesInDB.length + 1);
	});

	// test("new daily sale amount should add up to the total db daily sales amounts", async () => {

	//     // this block checks if the new sale value adds to what was already in the db
	//     let initialTotal = 0;
	//     initialDailySalesInDB.forEach(s => {
	//         for (let i = 0; i < s.productsSold.length; i++) {
	//             initialTotal += s.productsSold[i].selling_price.toNumber() * s.quantitySold[i]
	//         }
	//     })

	//     const dailySalTotal = initialDailySalesInDB.reduce((acc, curr) => acc + curr.amount_sold.toNumber(), 0);

	//     assert.strictEqual(initialTotal, dailySalTotal)
	// })
});

describe("Update an existing daily sale", () => {
	let allDailySales: DailySalesSummary[] = [];
	let dailySaleToUpdate: DailySalesSummary;
	const newGivenAmount = new Decimal(1.1);
	const newAmountSold = new Decimal(2.2);

	beforeEach(async () => {
		allDailySales = await getAllDailySales();
		dailySaleToUpdate = allDailySales[0];
		dailySaleToUpdate.amount_given = newGivenAmount;
		dailySaleToUpdate.amount_sold = newAmountSold;
	});

	test("without a token, should not update", async () => {
		const dailySales = await testApi
			.patch("/api/daily-sales")
			.send(dailySaleToUpdate)
			.expect(401);

		assert.strictEqual(dailySales.status, 401);
		assert(dailySales.headers["content-type"], "application.json");
	});

	test("with a token, it updates a new daily post", async () => {
		const savedDailySales = await testApi
			.patch("/api/daily-sales")
			.send(dailySaleToUpdate)
			.set("Authorization", `Bearer ${authToken}`);

		// console.log("dailySaleToUpdate: ", dailySaleToUpdate)
		// Since in this test I save a new daily sale
		const updatedDailySales = await getDailySaleFromID(dailySaleToUpdate.id);
		assert.strictEqual(savedDailySales.status, 200);
		// console.log("updatedDailySales: ", updatedDailySales)
		assert(savedDailySales.headers["content-type"], "application.json");
		assert.strictEqual(
			updatedDailySales?.amount_given.toNumber(),
			dailySaleToUpdate.amount_given.toNumber()
		);
		assert.strictEqual(
			updatedDailySales?.amount_sold.toNumber(),
			dailySaleToUpdate.amount_sold.toNumber()
		);
	});

	test("without a payload, should throw error and doesn't updates a new daily post", async () => {
		const errorResponse = await testApi
		.patch("/api/daily-sales")
		.send()
		.set("Authorization", `Bearer ${authToken}`);		

		const updatedDailySales = await getDailySaleFromID(dailySaleToUpdate.id);
		assert.strictEqual(errorResponse.status, 400);

		const error = errorResponse.body as ZodValidationError;

		console.log("🚀 ~ test ~ error:", error)

		assert("user_id" in error.fieldErrors);
		assert("date_of_sale_start" in error.fieldErrors);
		assert("date_of_sale_stop" in error.fieldErrors);
		assert("id" in error.fieldErrors);
		assert("created_at" in error.fieldErrors);
		assert("updated_at" in error.fieldErrors);
		assert.equal(error.error, 'Validation failed. Please correct the indicated fields.');
		assert(errorResponse.headers["content-type"], "application.json");
		assert.notEqual(
			updatedDailySales?.amount_given.toNumber(),
			dailySaleToUpdate.amount_given.toNumber()
		);
		assert.notEqual(
			updatedDailySales?.amount_sold.toNumber(),
			dailySaleToUpdate.amount_sold.toNumber()
		);
	});
});

describe("Delete a daily sale", () => {
	let allDailySales: DailySalesSummary[] = [];
	let dailySaleToDelete: DailySalesSummary;

	beforeEach(async () => {
		allDailySales = await getAllDailySales();
		dailySaleToDelete = allDailySales[0];
	});

	test("without a token, should not delete", async () => {
		const dailySales = await testApi
			.delete("/api/daily-sales")
			.send(dailySaleToDelete)
			.expect(401);

		assert.strictEqual(dailySales.status, 401);
		assert(dailySales.headers["content-type"], "application.json");
	});

	test("with a token, it delete a new daily sale", async () => {
		const savedDailySales = await testApi
			.delete("/api/daily-sales")
			.send(dailySaleToDelete)
			.set("Authorization", `Bearer ${authToken}`);

		// Since in this test I save a new daily sale
		const deletedDailySale = await getDailySaleFromID(dailySaleToDelete.id);
		const newAllDailySales = await getAllDailySales();
		assert.strictEqual(savedDailySales.status, 200);
		assert(savedDailySales.headers["content-type"], "application.json");
		assert.equal(deletedDailySale, null);
		assert.strictEqual(newAllDailySales.length, allDailySales.length - 1);
	});
});
