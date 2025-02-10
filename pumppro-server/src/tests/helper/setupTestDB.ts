import { before, after } from "node:test";
import supertest from "supertest";
import app from "../../app";
import prisma from "../../../client";
import { seed  } from "../../../prisma/seed";
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

before(async () => {
	console.log("Seeding the test db before all the tests...");
	seed();
	await AuthenticateTestUser(userToUseForTest)
	
	console.log("Everything setup for the test");
});

after(async () => {

	await prisma.$disconnect();
});

