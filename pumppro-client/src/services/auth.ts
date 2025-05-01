import { ConnectionError } from "errors/connectionError";
import { LogedUser } from "../types";
import api from "./api";

export const loginUser = async (values: {
  username: string;
  password: string;
}): Promise<LogedUser | null> => {
  try {
    const { data: user } = await api.post<LogedUser>(`auth`, values);

    return user;
  } catch (error) {
    console.log("🚀 ~ error in loginUser:", error);
    throw new ConnectionError({
      name: "Connection_Error",
      message: "Couldn't connect to the server",
    });
  }
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
