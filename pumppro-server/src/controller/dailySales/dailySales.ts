import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { validateExistingDailySale, validateNewDailySaleSummary } from "../../utils/validateData";
import { createDailySaleInDB, deleteDailySaleInDB, updateDailySaleInDB } from "./dailySales.service";

const prisma = new PrismaClient();

interface RequestQuery {
	startDate: string | undefined;
	stopDate: string | undefined;
	userID: string | undefined;
}

export const createWhereObject = (
	startDate: string | undefined,
	stopDate: string | undefined,
	userID: string | undefined
) => {
	let where = {};
	if (startDate && stopDate) {
		where = {
			...where,
			date_of_sale_start: {
				gte: startDate
			},
			date_of_sale_stop: {
				lte: stopDate
			}
		};
	}

	if (userID !== "") {
		where = {
			...where,
			user_id: userID
		};
	}
	return where;
};

export const getDailySales = async (
	req: Request<unknown, unknown, unknown, RequestQuery>,
	res: Response
) => {
	const { startDate, stopDate, userID } = req.query as RequestQuery;
	// remove seconds to have fix hours intervals
	const startDateDate = startDate ? new Date(startDate) : new Date();
	startDateDate.setHours(startDateDate.getHours() - 1);

	const stopDateDate = stopDate ? new Date(stopDate) : new Date();
	stopDateDate.setHours(stopDateDate.getHours() + 1);
	const where = createWhereObject(
		startDate ? startDateDate.toISOString() : undefined,
		stopDate ? stopDateDate.toISOString() : undefined,
		userID
	);

	const dailySales = await prisma.dailySalesSummary.findMany({
		select: {
			id: true,
			amount_sold: true,
			amount_given: true,
			date_of_sale_start: true,
			date_of_sale_stop: true,
			user: true,
			created_at: true
		},
		where: where
	});

	return res.send(dailySales);
};

export const saveDailySale = async (req: Request, res: Response) => {
	const newDailySale = validateNewDailySaleSummary(req.body);
	let savedDailySale = {};

	if (!newDailySale) {
		throw new Error("No Sale to be save");
	}

	savedDailySale = await createDailySaleInDB(newDailySale);

	return res.send(savedDailySale);
};

export const updateDailySale = async (req: Request, res: Response) => {
	const dailySaleToUpdate = validateExistingDailySale(req.body);

	if (!dailySaleToUpdate) {
		throw new Error("No Sale to be updated");
	}

	const updatedDailySale = await updateDailySaleInDB(dailySaleToUpdate);

	return res.send(updatedDailySale);
};

export const deleteDailySale = async (req: Request, res: Response) => {
	const dailySaleToDelete = validateExistingDailySale(req.body);

	if (!dailySaleToDelete) {
		throw new Error("No Sale to be deleted");
	}

	const deletedDailySale = await deleteDailySaleInDB(dailySaleToDelete);

	return res.send(deletedDailySale);
};

export const getDailySale = async (req: Request, res: Response) => {
	const newDailySale = validateNewDailySaleSummary(req.body);

	if (!newDailySale) {
		throw new Error("No Sale to be save");
	}

	const user = await prisma.user.findUnique({
		where: { id: newDailySale.user_id }
	});

	// remove seconds to have fix hours intervals
	const startDate = newDailySale.date_of_sale_start;
	startDate.setSeconds(0);
	const stopDate = newDailySale.date_of_sale_stop;
	startDate.setSeconds(0);

	const where = createWhereObject(
		startDate.toISOString(),
		stopDate.toISOString(),
		newDailySale.user_id
	);

	const dailySale = await prisma.dailySalesSummary.findFirst({
		where: where
	});

	if (!user) {
		throw new Error("This worker couldn't be found");
	}

	if (dailySale) {
		throw new Error("This worker already have a saved sale in this period");
	}

	return res.sendStatus(200);
};
