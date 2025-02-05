import { MessageNotification, Tank } from "types";
import api from "./api";

export const getMessages = async (
	userID?: string
): Promise<MessageNotification[]> => {
	const res = await api.get<MessageNotification[]>("/messages", {
		params: { userID: userID }
	});
	return res.data;
};

export const getMessage = async (id: number): Promise<MessageNotification> => {
	const res = await api.get<MessageNotification>(`/messages/${id}`);
	return res.data;
};

export const updateMessage = async (id: number) => {
	try {
		const res = await api.put("/messages", { id: id });
		return res.data;
	} catch (error: any) {
		console.log("🚀 ~ file: users.ts:13 ~ saveUser ~ error", error);
		if (error.response.status === 409) {
			throw new Error(error.response.data.error);
		}
	}
};
