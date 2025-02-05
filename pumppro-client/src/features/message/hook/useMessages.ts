import { useQuery } from "@tanstack/react-query";
import { MessageNotification } from "types";
import { getMessage, getMessages } from "services/messages";

export const useMessages = (userID?: string) => {
	const query = useQuery<MessageNotification[], Error>({
		queryKey: ["messages", userID],
		queryFn: () => getMessages(userID),
		enabled: userID !== ""
	});

	return query;
};

export const UseMessage = (messageID: number) => {
	const query = useQuery<MessageNotification, Error>({
		queryKey: ["message"],
		queryFn: () => getMessage(messageID),
		enabled: messageID !== null
	});

	return query;
};

// export const FindingsUpdateMutator = (
// 	userToUpdate: User,
// 	query: UseQueryResult<User, Error>
// ) => {
// 	const mutator = useMutation(() => updateUser(userToUpdate), {
// 		onSuccess: data => {
// 			query.refetch();
// 		},
// 		onError: error => {
// 			alert(error);
// 			console.log("error when mutating: ", error);
// 		}
// 	});

// 	return mutator;
// };
