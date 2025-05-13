import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  AuthError,
  BadRequestError,
  ConnectionError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  // ValidationError, // If you have it
} from "../errors/ApiErrors";
import { AppError } from "../errors/appError";
import storage from "utils/storage";

interface ApiErrorData {
  error: string; // This matches your backend: { error: "Only admin..." }
  // If your backend can send more structured errors, define them here:
  // e.g., message?: string; details?: Array<{ field: string, message: string }>;
}

// https://pumppro-server.onrender.com/
// http://localhost:5001/
// "http://10.0.0.73:5001/"
export const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();

    if (token) {
      config.withCredentials = true;
      config.headers.Authorization = `bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // This typically won't be an AxiosError, but a general JS error during request setup
    return Promise.reject(
      new AppError({
        name: "RequestSetupError",
        message: "Error setting up request",
        originalError: error,
      })
    );
  }
);

// Response error interceptor
const errorHandler = (axiosError: AxiosError<ApiErrorData>): Promise<never> => {
  const originalRequest = axiosError.config; // Useful for retries or logging

  if (axiosError.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const statusCode = axiosError.response.status;
    const apiMessage =
      axiosError.response.data?.error || // Your specific { error: "..." }
      (axiosError.response.data as any)?.message || // A more generic { message: "..." }
      axiosError.message; // Fallback to Axios's own message

    let customError: AppError;

    switch (statusCode) {
      case 400:
        // Here you could check if response.data has a specific structure for validation
        // and throw a ValidationError instead.
        // e.g. if (axiosError.response.data.details) {
        //   throw new ValidationError({ message: "Validation failed", errors: axiosError.response.data.details, originalError: axiosError });
        // }
        customError = new BadRequestError({
          message: apiMessage,
          originalError: axiosError,
        });
        break;
      case 401:
        customError = new AuthError({
          message: apiMessage,
          originalError: axiosError,
        });
        break;
      case 403:
        customError = new ForbiddenError({
          message: apiMessage,
          originalError: axiosError,
        });
        break;
      case 404:
        customError = new NotFoundError({
          message: apiMessage,
          originalError: axiosError,
        });
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        customError = new ServerError({
          message: "A server error occurred. Please try again later.",
          originalError: axiosError,
        });
        break;
      default:
        customError = new AppError({
          name: "UnknownApiError",
          message: `An unexpected API error occurred (Status: ${statusCode}): ${apiMessage}`,
          statusCode,
          originalError: axiosError,
        });
    }
    // Log the error with more details for developers
    console.error(
      `API Error: ${customError.name} (Status ${statusCode}) - ${customError.message}`,
      {
        request: originalRequest,
        response: axiosError.response,
        originalError: axiosError,
      }
    );
    throw customError;
  } else if (axiosError.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser
    let message = "The server did not respond. Please try again later.";
    if (
      axiosError.code === "ERR_NETWORK" ||
      axiosError.message === "Network Error"
    ) {
      // 'Network Error' for older Axios
      message =
        "Network connection lost. Please check your internet connection.";
    }
    console.error(
      `Network/Request Error: ${axiosError.code} - ${axiosError.message}`,
      { request: originalRequest, error: axiosError }
    );
    throw new ConnectionError({ message, originalError: axiosError });
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(`Client Setup Error: ${axiosError.message}`, {
      error: axiosError,
    });
    throw new AppError({
      name: "ClientSetupError",
      message: `Error setting up request: ${axiosError.message}`,
      originalError: axiosError,
    });
  }
};

apiClient.interceptors.response.use(
  (response) => response, // Directly return successful responses
  errorHandler // Use the centralized error handler
);

export default apiClient;
