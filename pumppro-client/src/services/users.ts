import { Role, User } from "types";
import api from "./api";
import { AuthError } from "errors/authError";
import { UserError } from "errors/userError";

export const saveUser = async (newUser: FormData) => {
	try {
		const res = await api.post("/users", newUser, {
			headers: { "Content-Type": "multipart/form-data" }
		});
		return res.data;
	} catch (error: any) {
		console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
		if (error.response.status === 409) {
			throw new UserError({
				name: "USER_ERROR",
				message: error.response.data.error
			});
		}
	}
};

// For now we get 1 and the same teacher the time to implement auth
// This method returns a user(User) for display
export const getUser = async (id: string): Promise<User> => {
	const { data: receivedUser } = await api.get<User>(`/users/${id}`);
	return receivedUser;
};

// For now we get 1 and the same teacher the time to implement auth
export const getUsers = async (role?: Role): Promise<User[]> => {
	const { data: receivedUser } = await api.get<User[]>(`/users`, {
		params: { role: role }
	});
	return receivedUser;
};

// For now we get 1 and the same teacher the time to implement auth
export const updateUser = async (updateUser: FormData) => {
	try {
		const res = await api.put("/users", updateUser, {
			headers: { "Content-Type": "multipart/form-data" }
		});

		return res.data;
	} catch (error: any) {
		console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
		if (error.response.status === 409) {
			throw new UserError({
				name: "USER_ERROR",
				message: error.response.data.error
			});
		}
		if (error.response.status === 401) {
			throw new AuthError({
				name: "AUTH_ERROR",
				message: error.response.data.error
			});
		}
		throw new UserError({
			name: "USER_ERROR",
			message: error.response.data.error
		});
	}
};

export const deleteUser = async (id: string) => {
	try {
		const res = await api.delete("/users", { data: { id: id } });

		return res.data;
	} catch (error: any) {
		if (error.response.status === 409) {
			throw new UserError({
				name: "USER_ERROR",
				message: error.response.data.error
			});
		}
		throw new UserError({
			name: "USER_ERROR",
			message: error.response.data.error
		});
	}
};
