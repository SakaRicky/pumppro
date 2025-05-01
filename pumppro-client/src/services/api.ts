import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthError } from "errors/authError";
import { BadRequestError } from "errors/badRequestError";
import { ConnectionError } from "errors/connectionError";
import storage from "utils/storage";

interface ErrorData {
  error: string;
  status: number;
}

// https://pumppro-server.onrender.com/
// http://localhost:5001/
// "http://10.0.0.73:5001/"
export const api = axios.create({
  baseURL: "http://localhost:5001/",
});

const requestInterceptor = (config: AxiosRequestConfig) => {
  // Get the token from storage (or wherever you store it)
  const token = storage.getToken();

  if (token) {
    // Make sure the config object has a headers property
    if (!config.headers) {
      config.headers = {};
    }

    config.withCredentials = true;
    config.headers.Authorization = `bearer ${token}`;
  }

  return config;
};

const successHandler = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const errorHandler = (errorResponse: AxiosError<ErrorData>): Promise<never> => {
  if (errorResponse.response) {
    const message = errorResponse.response.data.error || errorResponse.message;
    const responseErrorsMap: Record<number, () => Error | undefined> = {
      400: () =>
        new BadRequestError({
          name: "BAD_REQUEST_ERROR",
          message: message,
        }),
      401: () =>
        new AuthError({
          name: "AUTH_ERROR",
          message: message,
        }),
    };

    const errorStatusCode = errorResponse.response.status;

    const errorToThrow = responseErrorsMap[errorStatusCode];

    if (errorToThrow) {
      throw errorToThrow();
    }
  } else if (errorResponse.request) {
    console.log("Request Error Interceptors");

    if (errorResponse.code === "ERR_NETWORK") {
      throw new ConnectionError({
        name: "Connection_Error",
        message: "Couldn't connect to the server",
      });
    }
  } else {
    console.log("Error in api else", errorResponse);
    console.log("Error in api else: message: ", errorResponse.message);
  }

  return Promise.reject(errorResponse);
};

api.interceptors.request.use(requestInterceptor);

api.interceptors.response.use(successHandler, errorHandler);

export default api;
