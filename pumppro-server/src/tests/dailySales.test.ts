import { test, describe, beforeEach } from "node:test";
import { authToken, dailySaleToPost, testApi } from "./helper/setupTestDB";
import { dailySaleData, initialDailySales } from "../../prisma/seed";
import assert from "assert";
import { getAllDailySales } from "./helper/testsHelperFunctions";
import { DailySale } from "@prisma/client";

describe("getDailysales", async () => {
    test("get daily sales without an auth token", async () => {
        await testApi.get("/daily-sales").expect(401).expect("Content-Type", /application\/json/);
    })

    test("get daily sales with an auth token", async () => {

        const dailySales = await testApi
            .get("/daily-sales")
            .set("Authorization", `Bearer ${authToken}`);

        assert.strictEqual(dailySales.status, 200);
        assert(dailySales.headers['content-type'], "application.json");
        assert.strictEqual(dailySales.body.length, initialDailySales.length);
    })
})

describe("Save a new daily sale", () => {

    let allDailySales: DailySale[] = [];

    beforeEach(async () => {
        allDailySales = await getAllDailySales();
    })

    test("without a token, should not save", async () => {

        const dailySales = await testApi.post("/daily-sales").send(dailySaleToPost).expect(401);


        assert.strictEqual(dailySales.status, 401);
        assert(dailySales.headers['content-type'], "application.json");
    })

    test("with a token, it saves a new daily post", async () => {
        const savedDailySales = await testApi
                                            .post("/daily-sales")
                                            .send(dailySaleToPost)
                                            .set("Authorization", `Bearer ${authToken}`);
        
                                            // Since in this test I save a new daily sale
        allDailySales = await getAllDailySales();
        assert.strictEqual(savedDailySales.status, 200);
        assert(savedDailySales.headers['content-type'], "application.json");
        assert.strictEqual(allDailySales.length, initialDailySales.length + 1);
    })

    test("new daily sale amount should add up to the total db daily sales amounts", async () => {


        // this block checks if the new sale value adds to what was already in the db
        let initialTotal = 0;
        dailySaleData.forEach(s => {
            for (let i = 0; i < s.productsSold.length; i++) {
                initialTotal += s.productsSold[i].selling_price.toNumber() * s.quantitySold[i]
            }
        })

        const dailySalTotal = initialDailySales.reduce((acc, curr) => acc + curr.amount_sold.toNumber(), 0);

        assert.strictEqual(initialTotal, dailySalTotal)
    })
})