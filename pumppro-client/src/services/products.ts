import { Product } from "types";
import api from "./api";
import { AuthError } from "errors/authError";
import { UserError } from "errors/userError";
import { BadRequestError } from "errors/badRequestError";

export const saveProduct = async (newUser: FormData) => {
  try {
    const res = await api.post("/products", newUser, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    if (error instanceof BadRequestError) {
      throw error;
    }
  }
};

// This method returns a user(User) for display
export const getProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};

export const getProducts = async (categoryID?: string): Promise<Product[]> => {
  const { data } = await api.get<Product[]>(`/products`, {
    params: { categoryID: categoryID },
  });
  return data;
};

export const updateProduct = async (updateProduct: FormData) => {
  try {
    const res = await api.put("/products", updateProduct, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error: any) {
    if (error instanceof BadRequestError) {
      throw error;
    } else if (error.response.status === 401) {
      throw new AuthError({
        name: "AUTH_ERROR",
        message: error.response.data.error,
      });
    } else {
      throw new UserError({
        name: "USER_ERROR",
        message: error.response.data.error,
      });
    }
  }
};

export const deleteProduct = async (ids: string[]) => {
  try {
    const res = await api.delete("/products", { data: { ids: ids } });

    return res.data;
  } catch (error: any) {
    if (error.response.status === 409) {
      throw new UserError({
        name: "USER_ERROR",
        message: error.response.data.error,
      });
    }
    throw new UserError({
      name: "USER_ERROR",
      message: error.response.data.error,
    });
  }
};
