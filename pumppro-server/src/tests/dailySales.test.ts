import {test, describe} from "node:test";
import { authToken, dailySaleToPost, testApi } from "./helper/setupTestDB";
import { initialDailySales } from "../../prisma/seed";
import assert from "assert";
import prisma from "../../client";

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

describe("Save a new daily sale", async () => {

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
        
        const allDailySales = await prisma.dailySale.findMany({
            select: {
                id: true,
                amount_sold: true,
                amount_given: true,
                date_of_sale_start: true,
                date_of_sale_stop: true,
                fuel_counts: true,
                user: true,
                created_at: true
            },
        });
                
        assert.strictEqual(savedDailySales.status, 200);
        assert(savedDailySales.headers['content-type'], "application.json");
        assert.strictEqual(allDailySales.length, initialDailySales.length + 1);
    })
})