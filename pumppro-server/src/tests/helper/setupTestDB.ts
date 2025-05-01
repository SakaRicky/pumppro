/* eslint-disable @typescript-eslint/no-unused-vars */
import { beforeEach, afterEach } from "node:test";
import supertest from "supertest";
import app from "../../app";
import prisma from "../../../client";
import { seed } from "../../../prisma/seed";
import { findUserAndCreateAuthUser } from "../../controller/auth";
import { AuthenticatedUSer, UserToAuth } from "../../types";
import {
	DailySalesSummary,
	Product,
	ProductCategory,
	Sale,
	SaleDetail,
	User
} from "@prisma/client";
import { getAllSalesDetails } from "./testsHelperFunctions";

export const testApi = supertest(app);

const userToUseForTest = {
	username: "johndoe",
	password: "12345678"
};

export let authToken = "";

const AuthenticateTestUser = async (
	userToAuth: UserToAuth
): Promise<AuthenticatedUSer> => {
	const authenticatedUser = await findUserAndCreateAuthUser(userToAuth);
	authToken = authenticatedUser.token;

	return authenticatedUser;
};

// I do this here because I need this dailySale for more than 1 test.
export let dailySaleToPost = {};

export let initialDailySalesInDB: DailySalesSummary[] = [];
export let initialUsersInDB: User[] = [];
export let initialProductCategories: ProductCategory[] = [];
export let initialProducts: Product[] = [];
export let initialProductsSoldInDB: Sale[] = [];
export let initialSaleDetailsInDB: SaleDetail[] = [];

// This before is like beforeAll
beforeEach(async () => {
	const {
		users,
		initialProductCategoriesInDB,
		initialProductsInDB,
		savedDailySalesSummary,
		fuels,
		initialProductsSold,
		createdTanks
	} = await seed();

	initialDailySalesInDB = savedDailySalesSummary;
	initialUsersInDB = users;
	initialProductCategories = initialProductCategoriesInDB;
	initialProducts = initialProductsInDB;
	initialProductsSoldInDB = initialProductsSold;
	initialSaleDetailsInDB = await getAllSalesDetails();

	await AuthenticateTestUser(userToUseForTest);

	dailySaleToPost = {
		user_id: users[0].id, // get a user that was added to the test db at this moment of the test
		amount_sold: 500.0,
		amount_given: 480.0,
		date_of_sale_start: "2024-04-06T10:00:00Z",
		date_of_sale_stop: "2024-04-06T20:00:00Z",
		fuel_counts: [
			{
				fuel_id: fuels.find(f => f.fuel_type == "FUEL")?.id,
				start_count: 1000,
				stop_count: 1200
			},
			{
				fuel_id: fuels.find(f => f.fuel_type == "GASOIL")?.id,
				start_count: 800,
				stop_count: 950
			}
		]
	};
});

afterEach(async () => {
	await prisma.$disconnect();
});
