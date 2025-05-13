import { Role, User } from "types";
import api from "./api";

export const saveUser = async (newUser: FormData) => {
  const res = await api.post("/users", newUser, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
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
    params: { role: role },
  });
  return receivedUser;
};

// For now we get 1 and the same teacher the time to implement auth
export const updateUser = async (updateUser: FormData) => {
  const res = await api.put("/users", updateUser, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await api.delete("/users", { data: { id: id } });

  return res.data;
};
