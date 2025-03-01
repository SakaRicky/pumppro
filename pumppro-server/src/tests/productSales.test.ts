import { test, describe, beforeEach } from "node:test";
import { authToken, dailySaleToPost, initialProductsSoldInDB, testApi } from "./helper/setupTestDB";
import assert from "assert";
import { getAllDailySales, getDailySaleFromID } from "./helper/testsHelperFunctions";
import { DailySalesSummary } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

describe("Product Sales", async () => {
    test("Should not products sales without an auth token", async () => {
        await testApi.get("/daily-sales").expect(401).expect("Content-Type", /application\/json/);
    })

    test("Should get products sales with an auth token", async () => {

        const productsSales = await testApi
            .get("/product-sales")
            .set("Authorization", `Bearer ${authToken}`);

        assert.strictEqual(productsSales.status, 200);
        assert(productsSales.headers['content-type'], "application.json");
        assert.strictEqual(productsSales.body.length, initialProductsSoldInDB.length);
    })
})