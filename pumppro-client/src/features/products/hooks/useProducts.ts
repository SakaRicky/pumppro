import { useQuery } from "@tanstack/react-query";
import { Product } from "types";
import { getProduct, getProducts } from "services/products";

export const useProducts = (categoryID?: string) => {
  const query = useQuery<Product[], Error>({
    queryKey: ["products", categoryID],
    queryFn: () => getProducts(categoryID),
    enabled: categoryID !== "",
  });

  return query;
};

export const useProduct = (productID: string) => {
  const query = useQuery<Product, Error>({
    queryKey: ["product"],
    queryFn: () => getProduct(productID),
    enabled: productID !== "",
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
