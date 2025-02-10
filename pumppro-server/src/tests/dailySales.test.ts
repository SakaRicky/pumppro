import {test, describe} from "node:test";
import { authToken, testApi } from "./helper/setupTestDB";

describe("getDailysales", async () => {
    test("get daily sales without an auth token", async () => {
        await testApi.get("/daily-sales").expect(401).expect("Content-Type", /application\/json/);
    })

    test("get daily sales with an auth token", async () => {
        
        await testApi
                .get("/daily-sales")
                .set("Authorization", `Bearer ${authToken}`) // Attach the token
                .expect(200).expect("Content-Type", /application\/json/);
    })
})