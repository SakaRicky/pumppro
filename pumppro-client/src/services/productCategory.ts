import { NewProductCategory, ProductCategory } from "types";
import api from "./api";
import { AuthError } from "errors/authError";
import { UserError } from "errors/userError";

export const saveProductCategory = async (
  newProductCategory: NewProductCategory
): Promise<ProductCategory | undefined> => {
  try {
    const res = await api.post<ProductCategory>(
      "/categories/products",
      newProductCategory,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.data;
  } catch (error: any) {
    console.log("🚀 ~ file: productCategory.ts:15 ~ error", error);
    if (error.response.status === 409) {
      throw new Error(error.response.data.error);
    }
  }
};

// For now we get 1 and the same teacher the time to implement auth
// This method returns a user(User) for display
export const getProductCategory = async (
  id: string
): Promise<ProductCategory | undefined> => {
  try {
    const { data: receivedUser } = await api.get<ProductCategory>(
      `/categories/products/${id}`
    );
    console.log(
      "🚀 ~ file: productCategory.ts:29 ~ receivedUser",
      receivedUser
    );
    return receivedUser;
  } catch (error: any) {
    console.log("🚀 ~ file: productCategory.ts:15 ~ error", error);
    if (error.response.status) {
      throw new Error(error.response.data.error);
    }
  }
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
  try {
    const res = await api.put("/categories/products", updateProductCategory, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (error: any) {
    console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
    if (error.response.status === 409) {
      throw new UserError({
        name: "USER_ERROR",
        message: error.response.data.error,
      });
    }
    if (error.response.status === 401) {
      throw new AuthError({
        name: "AUTH_ERROR",
        message: error.response.data.error,
      });
    }
    throw new UserError({
      name: "USER_ERROR",
      message: error.response.data.error,
    });
  }
};

export const deleteProductCategory = async (id: string) => {
  try {
    const res = await api.delete("/categories/products", { data: { id: id } });

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
