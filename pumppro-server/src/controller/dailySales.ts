import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import { validateNewDailySale } from "../utils/validateData";

const prisma = new PrismaClient();

interface RequestQuery {
	startDate: string | undefined;
	stopDate: string | undefined;
	userID: string | undefined;
}

const createWhereObject = (
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

	const dailySales = await prisma.dailySale.findMany({
		select: {
			id: true,
			amount_sold: true,
			amount_given: true,
			difference: true,
			date_of_sale_start: true,
			date_of_sale_stop: true,
			start_count_fuel_1: true,
			stop_count_fuel_1: true,
			start_count_gasoil_1: true,
			stop_count_gasoil_1: true,
			start_count_fuel_2: true,
			stop_count_fuel_2: true,
			start_count_gasoil_2: true,
			stop_count_gasoil_2: true,
			start_count_fuel_3: true,
			stop_count_fuel_3: true,
			start_count_gasoil_3: true,
			stop_count_gasoil_3: true,
			start_count_gaz: true,
			stop_count_gaz: true,
			user: true,
			created_at: true
		},
		where: where
	});

	return res.send(dailySales);
};

export const saveDailySale = async (req: Request, res: Response) => {
	const newDailySale = validateNewDailySale(req.body);

	if (!newDailySale) {
		throw new Error("No Sale to be save");
	}

	const user = await prisma.user.findUnique({
		where: { id: newDailySale.user_id }
	});

	if (!user) {
		throw new Error("This worker couldn't be found");
	}

	// remove seconds to have fix hours intervals
	const savedDailySaleStartDate = new Date(
		newDailySale.date_of_sale_start.getTime()
	);
	savedDailySaleStartDate.setHours(savedDailySaleStartDate.getHours() - 1);
	const savedDailySaleStopDate = new Date(
		newDailySale.date_of_sale_stop.getTime()
	);
	savedDailySaleStopDate.setHours(savedDailySaleStopDate.getHours() + 1);

	const where = createWhereObject(
		savedDailySaleStartDate.toISOString(),
		savedDailySaleStopDate.toISOString(),
		newDailySale.user_id
	);

	const dailySale = await prisma.dailySale.findFirst({
		where: where
	});

	if (dailySale) {
		throw new Error("This worker already have a saved sale in this period");
	}

	// remove seconds to have fix hours intervals
	const newDailySaleStartDate = newDailySale.date_of_sale_start;
	newDailySaleStartDate.setSeconds(0);
	const newDailySaleStopDate = newDailySale.date_of_sale_stop;
	newDailySaleStopDate.setSeconds(0);

	if (user.role === Role.SALE) {
		await prisma.dailySale.create({
			data: {
				amount_sold: newDailySale.amount_sold,
				amount_given: newDailySale.amount_given,
				difference: newDailySale.amount_given - newDailySale.amount_sold,
				date_of_sale_start: newDailySale.date_of_sale_start,
				date_of_sale_stop: newDailySale.date_of_sale_stop,
				user: { connect: { id: user.id } }
			}
		});
	} else {
		await prisma.dailySale.create({
			data: {
				amount_sold: newDailySale.amount_sold,
				amount_given: newDailySale.amount_given,
				date_of_sale_start: newDailySaleStartDate,
				date_of_sale_stop: newDailySaleStopDate,
				difference: newDailySale.amount_given - newDailySale.amount_sold,
				start_count_fuel_1: newDailySale.start_count_fuel_1,
				stop_count_fuel_1: newDailySale.stop_count_fuel_1,
				start_count_gasoil_1: newDailySale.start_count_gasoil_1,
				stop_count_gasoil_1: newDailySale.stop_count_gasoil_1,
				start_count_fuel_2: newDailySale.start_count_fuel_2,
				stop_count_fuel_2: newDailySale.stop_count_fuel_2,
				start_count_gasoil_2: newDailySale.start_count_gasoil_2,
				stop_count_gasoil_2: newDailySale.stop_count_gasoil_2,
				start_count_fuel_3: newDailySale.start_count_fuel_3,
				stop_count_fuel_3: newDailySale.stop_count_fuel_3,
				start_count_gasoil_3: newDailySale.start_count_gasoil_3,
				stop_count_gasoil_3: newDailySale.stop_count_gasoil_3,
				start_count_gaz: newDailySale.start_count_gaz,
				stop_count_gaz: newDailySale.stop_count_gaz,
				user: { connect: { id: user.id } }
			}
		});
	}

	return res.sendStatus(200);
};

export const getDailySale = async (req: Request, res: Response) => {
	const newDailySale = validateNewDailySale(req.body);

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

	const dailySale = await prisma.dailySale.findFirst({
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
