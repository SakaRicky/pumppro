import { Fuel, NewFuel } from "types";
import api from "./api";

export const getFuels = async (): Promise<Fuel[]> => {
	const res = await api.get<Fuel[]>("/fuel");
	return res.data;
};

export const getFuel = async (fuelID: string): Promise<Fuel> => {
	const res = await api.get<Fuel>(`/fuel/${fuelID}`);
	return res.data;
};

export const saveFuel = async (fuel: NewFuel) => {
	try {
		console.log("Saving fuel service");
		const res = await api.post("/fuel", fuel);
		return res.data;
	} catch (error: any) {
		console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
		if (error.response.status === 409) {
			throw new Error(error.response.data.error);
		}
		throw new Error(error.response.data.error);
	}
};

export const updateFuel = async (
	fuel: NewFuel & { id: number; created_at: Date; updatedAt: Date }
) => {
	try {
		console.log("updating fuel service");
		const res = await api.put("/fuel", fuel);
		return res.data;
	} catch (error: any) {
		console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
		if (error.response.status === 409) {
			throw new Error(error.response.data.error);
		}
	}
};

export const refillFuel = async (fuel: { id: number; quantity: number }) => {
	try {
		console.log("updating fuel service");
		const res = await api.patch("/fuel", fuel);
		return res.data;
	} catch (error: any) {
		console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
		if (error.response.status === 409) {
			throw new Error(error.response.data.error);
		}
	}
};

export const deleteFuel = async (ids: number[]) => {
	console.log("deleting fuel service");
	try {
		const res = await api.delete("/fuel", { data: { ids: ids } });
		return res.data;
	} catch (error: any) {
		console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
		if (error.response.status === 409) {
			throw new Error(error.response.data.error);
		}
	}
};
