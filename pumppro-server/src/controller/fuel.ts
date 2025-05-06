import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
	validateExistingFuel,
	validateExistingTank,
	validateNewFuel
} from "../utils/validateData";

const prisma = new PrismaClient();

export const getFuels = async (_req: Request, res: Response) => {
	console.log("getting fuels");
	const fuels = await prisma.fuel.findMany({
		select: {
			id: true,
			name: true,
			purchase_price: true,
			selling_price: true,
			description: true,
			tank: true,
			quantity_theory: true,
			quantity_actual: true,
			created_at: true,
			fuel_type: true,
			updated_at: true
		}
	});

	return res.send(fuels);
};

export const saveFuel = async (req: Request, res: Response) => {
	const newFuel = validateNewFuel(req.body);

	if (newFuel) {
		await prisma.fuel.create({
			data: {
				name: newFuel.name,
				fuel_type: newFuel.fuel_type,
				purchase_price: newFuel.purchase_price,
				selling_price: newFuel.selling_price,
				quantity_theory: newFuel.quantity_theory,
				quantity_actual: newFuel.quantity_actual,
				description: newFuel.description,
				tank_id: newFuel.tank_id
			}
		});
	}

	return res.sendStatus(200);
};

export const updateFuel = async (req: Request, res: Response) => {
	const fuelUpdate = validateExistingFuel(req.body);

	if (fuelUpdate) {
		await prisma.fuel.update({
			where: { id: fuelUpdate.id },
			data: {
				name: fuelUpdate.name,
				purchase_price: fuelUpdate.purchase_price,
				selling_price: fuelUpdate.selling_price,
				quantity_theory: fuelUpdate.quantity_theory,
				quantity_actual: fuelUpdate.quantity_actual,
				description: fuelUpdate.description,
				tank_id: fuelUpdate.tank_id
			}
		});
	}

	return res.sendStatus(200);
};

export const refillFuel = async (req: Request, res: Response) => {
	const fuelUpdate = validateExistingTank(req.body);

	const fuel = await prisma.fuel.findUnique({ where: { id: fuelUpdate?.id } });

	if (fuelUpdate && fuel) {
		await prisma.fuel.update({
			where: { id: fuelUpdate.id },
			data: {
				quantity_theory: fuel.quantity_theory.add(fuelUpdate.capacity),
				quantity_actual: fuel.quantity_actual.add(fuelUpdate.capacity)
			}
		});
	}

	return res.sendStatus(200);
};

export interface DeleteFuelRequestBody {
	fuelID: number; // Assuming IDs are strings
}

export const deleteFuel = async (
	req: Request<unknown, unknown, DeleteFuelRequestBody>,
	res: Response
) => {
	const body = req.body;
	const fuelIdToDelete = body.fuelID;

	const deletedFuel = await prisma.fuel.delete({
		where: {
			id: fuelIdToDelete
		}
	});

	return res.send(deletedFuel);
};
