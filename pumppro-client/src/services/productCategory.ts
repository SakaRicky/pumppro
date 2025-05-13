import { NewProductCategory, ProductCategory } from "types";
import api from "./api";

export const saveProductCategory = async (
  newProductCategory: NewProductCategory
): Promise<ProductCategory | undefined> => {
  const res = await api.post<ProductCategory>(
    "/categories/products",
    newProductCategory,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.data;
};

// For now we get 1 and the same teacher the time to implement auth
// This method returns a user(User) for display
export const getProductCategory = async (
  id: string
): Promise<ProductCategory | undefined> => {
  const { data: receivedUser } = await api.get<ProductCategory>(
    `/categories/products/${id}`
  );

  return receivedUser;
};

// For now we get 1 and the same teacher the time to implement auth
export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const { data: receivedUser } =
    await api.get<ProductCategory[]>(`/categories/products`);
  return receivedUser;
};

// For now we get 1 and the same teacher the time to implement auth
export const updateProductCategory = async (
  updateProductCategory: ProductCategory
) => {
  const res = await api.put("/categories/products", updateProductCategory, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
};

export const deleteProductCategory = async (id: string) => {
  const res = await api.delete("/categories/products", { data: { id: id } });

  return res.data;
};
