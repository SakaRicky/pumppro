import { useQuery } from "@tanstack/react-query";
import { getDailySales } from "services/dailySales";
import {
  getSale,
  getSales,
  getSalesSummary,
  GetSaleSummaryType,
} from "services/sales";
import { DailySale, Sale } from "types";

export const useSales = (
  isAllSales: boolean,
  userID?: string,
  startDate?: string,
  stopDate?: string,
  selectedCategoryID?: string
) => {
  const query = useQuery<Sale[], Error>({
    queryKey: ["sales", startDate, stopDate, userID, selectedCategoryID],
    queryFn: () =>
      getSales(isAllSales, startDate, stopDate, userID, selectedCategoryID),
  });

  return query;
};

export const useSalesSummary = (
  startDate?: string,
  stopDate?: string,
  userID?: string,
  selectedCategoryID?: string
) => {
  const saleUserID = userID === "all" ? "" : userID;
  const query = useQuery<GetSaleSummaryType, Error>({
    queryKey: ["salesSummary", startDate, stopDate, userID, selectedCategoryID],
    queryFn: () =>
      getSalesSummary(startDate, stopDate, saleUserID, selectedCategoryID),
    // enabled:
  });

  return query;
};

export const useDailySales = (
  startDate?: string,
  stopDate?: string,
  userID?: string
) => {
  const saleUserID = userID === "all" ? "" : userID;
  const query = useQuery<DailySale[], Error>({
    queryKey: ["dailySales", startDate, stopDate, userID],
    queryFn: () => getDailySales(startDate, stopDate, saleUserID),
    // enabled:
  });

  return query;
};

export const useSale = (saleId: string) => {
  const query = useQuery<Sale, Error>({
    queryKey: ["sales", saleId],
    queryFn: () => getSale(saleId),
  });

  return query;
};

// export const FindingsUpdateMutator = (
// 	userToUpdate: User,
// 	query: UseQueryResult<User, Error>
// ) => {
// 	const mutator = useMutation(() => updateUser(userToUpdate), {
// 		onSuccess: data => {
// 			query.refetch();
// 		},
// 		onError: error => {
// 			alert(error);
// 			console.log("error when mutating: ", error);
// 		}
// 	});

// 	return mutator;
// };
