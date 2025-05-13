import { Sale, SalesSummary } from "types";
import api from "./api";

export const saveSale = async (newSale: any) => {
  const res = await api.post("/product-sales", newSale);
  return res.data;
};

// For now we get 1 and the same teacher the time to implement auth
// This method returns a user(User) for display
export const getSale = async (id: string): Promise<Sale> => {
  const { data } = await api.get<Sale>(`/product-sales/${id}`);
  return data;
};

// For now we get 1 and the same teacher the time to implement auth
export const getSales = async (
  isAllSales: boolean,
  startDate?: string,
  stopDate?: string,
  userID?: string,
  selectedCategoryID?: string
): Promise<Sale[]> => {
  const { data } = isAllSales
    ? await api.get<Sale[]>(`/product-sales/all`, {
        params: { userID },
      })
    : await api.get<Sale[]>(`/product-sales`, {
        params: { startDate, stopDate, userID, selectedCategoryID },
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
    params: { startDate, stopDate, userID, selectedCategoryID },
  });
  return data;
};

// For now we get 1 and the same teacher the time to implement auth
export const updateSale = async (updateUser: FormData) => {
  const res = await api.put("/product-sales", updateUser, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const deleteSale = async (ids: string[]) => {
  const res = await api.delete("/product-sales", { data: { ids: ids } });

  return res.data;
};
