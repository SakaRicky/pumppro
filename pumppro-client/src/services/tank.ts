import { NewFuel, NewTank, Tank } from "types";
import api from "./api";

export const getTanks = async (): Promise<Tank[]> => {
  const res = await api.get<Tank[]>("/tank");
  return res.data;
};

export const getTank = async (fuelID: string): Promise<Tank> => {
  const res = await api.get<Tank>(`/tank/${fuelID}`);
  return res.data;
};

export const saveTank = async (fuel: NewTank) => {
  try {
    const res = await api.post("/tank", fuel);
    return res.data;
  } catch (error: any) {
    console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
    if (error.response.status === 409) {
      throw new Error(error.response.data.error);
    }
  }
};

export const updateTank = async (fuel: NewFuel & { id: string }) => {
  try {
    console.log("updating fuel service");
    const res = await api.put("/tank", fuel);
    return res.data;
  } catch (error: any) {
    console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
    if (error.response.status === 409) {
      throw new Error(error.response.data.error);
    }
  }
};

export const deleteTank = async (fuel: any) => {
  console.log("deleting fuel service");
  // try {
  // 	const res = await api.put("/fuel", fuel);
  // 	return res.data;
  // } catch (error: any) {
  // 	console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
  // 	if (error.response.status === 409) {
  // 		throw new Error(error.response.data.error);
  // 	}
  // }
};
