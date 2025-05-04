import { setAlert, useStateValue } from "state";
import { AlertType } from "../types";
import { useCallback, useRef } from "react";

export const useNotify = () => {
  const [, dispatch] = useStateValue();
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const notify = useCallback(
    (title: string, message: string, type: AlertType) => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }

      setTimeout(() => {
        dispatch(
          setAlert({
            show: true,
            title,
            message,
            type: type,
          })
        );

        // Set a new timeout to clear the alert after 10 seconds.
        const id = setTimeout(() => {
          dispatch({ type: "SET_ALERT", payload: null });
          timerIdRef.current = null;
        }, 5000);

        timerIdRef.current = id;
      }, 0);
    },
    [dispatch]
  );

  return notify;
};
