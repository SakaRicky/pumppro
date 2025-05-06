import { FuelSale, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { RequestWithToken } from "../utils/middleware";
import {
	validateNewFuelSale,
	validateExistingFuelSale
} from "../utils/validateData";
import { SaleFilterCriteria } from "./sales";
// import { createNotificationForAdmins } from "./utils/notification";

const prisma = new PrismaClient();

interface RequestQuery {
	startDate: string | undefined;
	stopDate: string | undefined;
	userID: string | undefined;
}

const getAllFuels = async (where: SaleFilterCriteria): Promise<FuelSale[]> => {
	return await prisma.fuelSale.findMany({
		select: {
			id: true,
			user: {
				select: {
					names: true,
					username: true,
					profile_picture: true
				}
			},
			user_id: true,
			fuel: true,
			fuel_id: true,
			start_reading: true,
			end_reading: true,
			quantity_sold: true,
			total_amount: true,
			created_at: true,
			updated_at: true
		},
		where: where,
		orderBy: {
			created_at: "desc"
		}
	});
};

export const getFuelSales = async (
	req: Request<unknown, unknown, unknown, RequestQuery>,
	res: Response
) => {
	const { startDate, stopDate, userID } = req.query;

	let where: SaleFilterCriteria = {};

	if (startDate && stopDate) {
		where = {
			...where,
			created_at: {
				gte: new Date(startDate),
				lte: new Date(stopDate)
			}
		};
	}

	if (userID !== "") {
		where = {
			...where,
			user_id: userID
		};
	}

	const fuelsSold = await getAllFuels(where);

	return res.send(fuelsSold);
};

export const getOneFuelSale = async (req: Request, res: Response) => {
	const { id } = req.params;

	const productFound = await prisma.fuelSale.findUnique({
		where: {
			id: Number(id)
		},
		select: {
			id: true,
			user: {
				select: {
					names: true,
					username: true,
					profile_picture: true
				}
			},
			user_id: true,
			fuel: true,
			fuel_id: true,
			start_reading: true,
			end_reading: true,
			quantity_sold: true,
			total_amount: true,
			created_at: true,
			updated_at: true
		}
	});
	return res.send(productFound);
};

export const saveFuelSale = async (req: RequestWithToken, res: Response) => {
	const newFuelSale = validateNewFuelSale(req.body);
	if (!newFuelSale) {
		throw new Error("Now Sale to be save");
	}

	const fuel = await prisma.fuel.findUnique({
		where: { id: newFuelSale.fuel_id }
	});

	if (!fuel) {
		throw new Error("The fuel you provided isn't in the database");
	}

	await prisma.fuelSale.create({
		data: {
			user_id: newFuelSale.user_id,
			fuel_id: newFuelSale.fuel_id,
			start_reading: newFuelSale.start_reading,
			end_reading: newFuelSale.end_reading,
			quantity_sold: newFuelSale.end_reading.minus(newFuelSale.start_reading),
			total_amount: fuel.selling_price.mul(
				newFuelSale.end_reading.minus(newFuelSale.start_reading)
			)
		}
	});

	return res.sendStatus(200);
};

export const updateFuelSale = async (req: RequestWithToken, res: Response) => {
	const existingFuelSale = validateExistingFuelSale(req.body);
	if (!existingFuelSale) {
		throw new Error("Now fuel sale to be updated");
	}

	const fuel = await prisma.fuel.findUnique({
		where: { id: existingFuelSale.fuel_id }
	});

	if (!fuel) {
		throw new Error("The fuel you provided isn't in the database");
	}

	await prisma.fuelSale.update({
		data: {
			user_id: existingFuelSale.user_id,
			fuel_id: existingFuelSale.fuel_id,
			start_reading: existingFuelSale.start_reading,
			end_reading: existingFuelSale.end_reading,
			quantity_sold: existingFuelSale.end_reading.minus(
				existingFuelSale.start_reading
			),
			total_amount: fuel.selling_price.mul(
				existingFuelSale.end_reading.minus(existingFuelSale.start_reading)
			)
		},
		where: { id: existingFuelSale.id }
	});

	return res.sendStatus(200);
};

export const deleteFuelSale = async (
	req: Request<unknown, unknown, { id: number }>,
	res: Response
) => {
	const body = req.body;
	const fuelSalesToDelete = body.id;

	await prisma.fuelSale.delete({
		where: {
			id: fuelSalesToDelete
		}
	});

	return res.sendStatus(200);
};

export interface DeleteFuelSalesRequestBody {
	ids: number[]; // Assuming IDs are strings
}

export const deleteManyFuelSale = async (
	req: Request<unknown, unknown, DeleteFuelSalesRequestBody>,
	res: Response
) => {
	const body = req.body;
	const fuelSalesToDelete = body.ids;

	await prisma.fuelSale.deleteMany({
		where: {
			id: {
				in: fuelSalesToDelete
			}
		}
	});

	return res.sendStatus(200);
};
