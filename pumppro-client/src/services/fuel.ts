import { Fuel, NewFuel } from "types";
import api from "./api";
import { AxiosError } from "axios";

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

export const updateFuel = async (fuel: Fuel) => {
  try {
    const res = await api.put("/fuel", { ...fuel });
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
  } catch (error: unknown) {
    console.log("🚀 ~ file: users.ts:46 ~ refillFuel ~ error", error);
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 409) {
        throw new Error(error.response.data.error);
      }
    }

    throw error;
  }
};

export const deleteFuel = async (fuelID: number) => {
  console.log("deleting fuel service");
  try {
    const res = await api.delete("/fuel", { data: { fuelID: fuelID } });
    return res.data;
  } catch (error: any) {
    console.log("🚀 ~ file: fuel.ts:13 ~ deleteFuel ~ error", error);
    throw new Error(error.response.data.error);
  }
};
