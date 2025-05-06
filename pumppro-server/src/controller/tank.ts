import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { validateExistingTank } from "../utils/validateData";
import { NewTank } from "../types";

const prisma = new PrismaClient();

export const getTanks = async (_req: Request, res: Response) => {
	console.log("getting tanks");
	const tanks = await prisma.tank.findMany({
		select: {
			id: true,
			name: true,
			capacity: true,
			created_at: true,
			updated_at: true
		}
	});

	return res.send(tanks);
};

export const saveTank = async (req: Request, res: Response) => {
	// const newDailySale = validateNewDailySale(req.body);

	console.log("req.body: ", req.body);

	const newTank = req.body as NewTank;

	await prisma.tank.create({
		data: {
			name: newTank.name,
			capacity: newTank.capacity
		}
	});

	return res.sendStatus(200);
};

export const updateTank = async (req: Request, res: Response) => {
	const fuelUpdate = validateExistingTank(req.body);

	console.log("fuelUpdate: ", fuelUpdate);

	if (!fuelUpdate) {
		throw new Error("No Fuel to update was given");
	}

	const fuel = await prisma.fuel.findUnique({ where: { id: fuelUpdate.id } });

	if (!fuel) {
		throw new Error("This fuel don't exist anymore");
	}

	const updated = await prisma.fuel.update({
		where: { id: fuelUpdate.id },
		data: {
			quantity_theory: fuel.quantity_theory.add(fuelUpdate.capacity),
			quantity_actual: fuel.quantity_actual.add(fuelUpdate.capacity)
		}
	});
	console.log("🚀 ~ file: fuel.ts:53 ~ updateFuel ~ updated:", updated);

	return res.send(updated);
};
