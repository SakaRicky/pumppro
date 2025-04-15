import { Sale, SalesSummary } from "types";
import api from "./api";
import { AuthError } from "errors/authError";
import { UserError } from "errors/userError";

export const saveSale = async (newSale: any) => {

	try {
		const res = await api.post("/product-sales", newSale);
		return res.data;
	} catch (error: any) {
		// console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
		// if (error.response.status === 409) {
		// 	throw new Error(error.response.data.error);
		// }
		// if (error.response.status === 500) {
		// 	throw new Error(error.response.data.error);
		// }
		throw error;
	}
};

// For now we get 1 and the same teacher the time to implement auth
// This method returns a user(User) for display
export const getSale = async (id: string): Promise<Sale> => {
	const { data } = await api.get<Sale>(`/product-sales/${id}`);
	return data;
};

// For now we get 1 and the same teacher the time to implement auth
export const getSales = async (
	startDate?: string,
	stopDate?: string,
	userID?: string,
	selectedCategoryID?: string
): Promise<Sale[]> => {
	const { data } = await api.get<Sale[]>(`/product-sales`, {
		params: { startDate, stopDate, userID, selectedCategoryID }
	});
	return data;
};

export type GetSaleSummaryType = {
	salesSummary: SalesSummary[];
	totalAmountSoldForThisPeriodInThisCategory: number;
	totalAmountSoldAllCategories: number;
	benefitsForThisPeriodInThisCategory: number;
};

// For now we get 1 and the same teacher the time to implement auth
export const getSalesSummary = async (
	startDate?: string,
	stopDate?: string,
	userID?: string,
	selectedCategoryID?: string
): Promise<GetSaleSummaryType> => {
	const { data } = await api.get<GetSaleSummaryType>(`/salessummary`, {
		params: { startDate, stopDate, userID, selectedCategoryID }
	});
	return data;
};

// For now we get 1 and the same teacher the time to implement auth
export const updateSale = async (updateUser: FormData) => {
	try {
		const res = await api.put("/product-sales", updateUser, {
			headers: { "Content-Type": "multipart/form-data" }
		});

		return res.data;
	} catch (error: any) {
		console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
		if (error.response.status === 409) {
			throw new UserError({
				name: "USER_ERROR",
				message: error.response.data.error
			});
		}
		if (error.response.status === 401) {
			throw new AuthError({
				name: "AUTH_ERROR",
				message: error.response.data.error
			});
		}
		throw new UserError({
			name: "USER_ERROR",
			message: error.response.data.error
		});
	}
};

export const deleteSale = async (ids: string[]) => {
	try {
		const res = await api.delete("/product-sales", { data: { ids: ids } });

		return res.data;
	} catch (error: any) {
		if (error.response.status === 409) {
			throw new UserError({
				name: "USER_ERROR",
				message: error.response.data.error
			});
		}
		throw new UserError({
			name: "USER_ERROR",
			message: error.response.data.error
		});
	}
};
