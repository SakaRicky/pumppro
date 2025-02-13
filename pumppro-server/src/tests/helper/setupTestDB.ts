import { before, after } from "node:test";
import supertest from "supertest";
import app from "../../app";
import prisma from "../../../client";
import { createdUsers, createdFuels, seed } from "../../../prisma/seed";
import { findUserAndCreateAuthUser } from "../../controller/auth";
import { AuthenticatedUSer, UserToAuth } from "../../types";


export const testApi = supertest(app);

let userToUseForTest = {
	username: "johndoe",
	password: "12345678"
};

export let authToken = "";

const AuthenticateTestUser = async (userToAuth: UserToAuth): Promise<AuthenticatedUSer> => {
	const authenticatedUser = await findUserAndCreateAuthUser(userToAuth);
	authToken = authenticatedUser.token

	console.log("Authenticated user with token: ", authToken);

	return authenticatedUser;
}

// I do this here because I need this dailySale for more than 1 test.
export let dailySaleToPost = {}

// This before is like beforeAll
before(async () => {
	console.log("Seeding the test db before all the tests...");
	await seed();
	await AuthenticateTestUser(userToUseForTest)

	dailySaleToPost = {
		user_id: createdUsers[0].id, // get a user that was added to the test db at this moment of the test
		amount_sold: 500.0,
		amount_given: 480.0,
		date_of_sale_start: "2024-04-06T10:00:00Z",
		date_of_sale_stop: "2024-04-06T20:00:00Z",
		fuel_counts: [
			{ fuel_id: createdFuels.find(f => f.fuel_type == "FUEL")?.id, start_count: 1000, "stop_count": 1200 },
			{ fuel_id: createdFuels.find(f => f.fuel_type == "GASOIL")?.id, start_count: 800, "stop_count": 950 }
		]
	}

	console.log("Everything setup for the test");
});

after(async () => {

	await prisma.$disconnect();
});

