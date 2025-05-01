import { setAlert, useStateValue } from "state";
import { AlertType } from "../types";
import { useCallback } from "react";

export const useNotify = () => {
  const [, dispatch] = useStateValue();

  const notify = useCallback((title: string, message: string, type: AlertType) => {
    dispatch(
      setAlert({
        show: true,
        title,
        message,
        type: type,
      })
    );
    const timer = setTimeout(() => { // Store timer ID
      dispatch({ type: "SET_ALERT", payload: null });
    }, 5000);

  }, [dispatch]);

  return notify;
};
