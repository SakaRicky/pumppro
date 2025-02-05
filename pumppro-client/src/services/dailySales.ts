import { DailySale, NewDailySale, Product } from "types";
import api from "./api";

export const saveDailySales = async (sales: NewDailySale) => {
	try {
		console.log("saving daily sales service");
		const res = await api.post("/daily-sales", sales);
		return res.data;
	} catch (error: any) {
		console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
		if (error.response.status === 409) {
			throw new Error(error.response.data.error);
		}
	}
};

// For now we get 1 and the same teacher the time to implement auth
// This method returns a user(User) for display
export const getDailySale = async (id: string): Promise<DailySale> => {
	const { data } = await api.get<DailySale>(`/daily-sales/${id}`);
	return data;
};

// For now we get 1 and the same teacher the time to implement auth
export const getDailySales = async (
	startDate?: string,
	stopDate?: string,
	userID?: string
): Promise<DailySale[]> => {
	const { data } = await api.get<DailySale[]>(`/daily-sales`, {
		params: { startDate, stopDate, userID }
	});
	return data;
};
