import axios, { AxiosRequestConfig } from "axios";
import { AuthError } from "errors/authError";
import { BadRequestError } from "errors/badRequestError";
import { ConnectionError } from "errors/connectionError";
import storage from "utils/storage";

// https://pumppro-server.onrender.com/
// http://localhost:5001/
export const api = axios.create({
	baseURL: "http://localhost:5001/"
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

	// console.log("config: ", config);

	return config;
};

api.interceptors.request.use(requestInterceptor);

api.interceptors.response.use(
	response => response,
	error => {
		// Handle connection errors here
		if (error.response) {
			const message = error.response?.data?.message || error.message;

			if (error.response.status === 401) {
				throw new AuthError({
					name: "AUTH_ERROR",
					message: error.response.data.error
				});
			}
			if (error.response.status === 400) {
				console.log("error 400");

				throw new BadRequestError({
					name: "BAD_REQUEST_ERROR",
					message: error.response.data.error
				});
			}
		} else if (error.request) {
			console.log("Request Error Interceptors");
			console.log("error.response: ", error);
		} else {
			console.log("Error in api else", error);
			console.log("Error in api else: message: ", error.message);
		}
		if (error.code === "ERR_NETWORK") {
			throw new ConnectionError({
				name: "Connection_Error",
				message: "Couldn't connect to the server"
			});
		}
		return Promise.reject(error);
	}
);

export default api;
