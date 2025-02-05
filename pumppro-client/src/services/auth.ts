import { LogedUser } from "../types";
import api from "./api";

export const loginUser = async (values: {
	username: string;
	password: string;
}): Promise<LogedUser> => {
	const { data: user } = await api.post<LogedUser>(`auth`, values);

	return user;
};

export const verifyAuthUser = async (): Promise<
	{ user: LogedUser; isAuthenticated: boolean } | undefined
> => {
	const { data: userAuthStatus } = await api.get<{
		user: LogedUser;
		isAuthenticated: boolean;
	}>(`/auth/user`);
	return userAuthStatus;
};
