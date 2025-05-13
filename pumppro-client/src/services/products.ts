import { Product } from "types";
import api from "./api";
import { isAxiosError } from "axios";
import { BadRequestError } from "errors/ApiErrors";

export const saveProduct = async (newProduct: FormData) => {
  try {
    const res = await api.post("/products", newProduct, {
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

interface ApiErrorResponse {
  error: string;
}

export const updateProduct = async (updateProduct: FormData) => {
  try {
    const res = await api.put("/products", updateProduct, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error: unknown) {
    console.log("🚀 ~ updateProduct ~ error:", error);
    if (isAxiosError<ApiErrorResponse>(error)) {
      // Now 'error' is typed as AxiosError<ApiErrorResponse>
      // and error.response?.data will be typed as ApiErrorResponse | undefined

      if (error.response) {
        // error.response.data is now strongly typed as ApiErrorResponse
        console.error("Status Code:", error.response.status);
        console.error("API Error Message:", error.response.data.error); // Type-safe!
        alert(`Error ${error.response.status}: ${error.response.data.error}`);
      } else if (error.request) {
        console.error("Network Error: No response received.", error.request);
        alert("Network error. Please try again later.");
      } else {
        console.error("Error setting up request:", error.message);
        alert("An error occurred while sending the request.");
      }
    } else {
      console.error("An unexpected error occurred:", error);
      alert("An unexpected error occurred.");
    }

    throw error;
    // if (error instanceof BadRequestError) {
    //   throw error;
    // } else if (error.response.status === 401) {
    //   throw new AuthError({
    //     name: "AUTH_ERROR",
    //     message: error.response.data.error,
    //   });
    // } else {
    //   throw new UserError({
    //     name: "USER_ERROR",
    //     message: error.response.data.error,
    //   });
    // }
  }
};

export const deleteProduct = async (ids: string[]) => {
  try {
    const res = await api.delete("/products", { data: { ids: ids } });

    return res.data;
  } catch (error: unknown) {
    throw error;
  }
};
