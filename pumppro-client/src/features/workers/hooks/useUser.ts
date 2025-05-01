import { useQuery } from "@tanstack/react-query";
import { User } from "types";
import { getUser, getUsers } from "services/users";

export const useUsers = () => {
  const query = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  return query;
};

export const useUser = (userID: string) => {
  const query = useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: () => getUser(userID),
    enabled: userID !== "",
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
