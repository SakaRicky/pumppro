import { setAlert, useStateValue } from "state";
import { AlertType } from "../types";

export const useNotify = () => {
	const [, dispatch] = useStateValue();

	const notify = (title: string, message: string, type: AlertType) => {
		dispatch(
			setAlert({
				show: true,
				title,
				message,
				type: type
			})
		);
		setTimeout(() => {
			dispatch({ type: "SET_ALERT", payload: null });
		}, 5000);
	};

	return notify;
};
