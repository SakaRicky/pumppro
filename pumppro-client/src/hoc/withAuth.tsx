import { useCallback, useEffect, useState } from "react";
import { setLogedUser, useStateValue } from "state";
import { useNavigate } from "react-router-dom";
import { verifyAuthUser } from "services/auth";
import { useNotify } from "hooks/useNotify";
import storage from "utils/storage";
import { AuthError } from "errors/ApiErrors";

function withAuth<T>(WrappedComponent: React.ComponentType<T>) {
  return function Authenticated(props: T) {
    const [state, dispatch] = useStateValue();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );
    const navigate = useNavigate();
    const notify = useNotify();

    const checkAuthUser = useCallback(async () => {
      try {
        const authenticatedStatus = await verifyAuthUser();

        if (authenticatedStatus?.isAuthenticated) {
          dispatch(setLogedUser(authenticatedStatus.user));
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        if (error instanceof AuthError) {
          notify(error.name, error.message, "error");
          storage.clearToken();
          navigate("/login");
        }
        notify(error.name, error.message, "error");
      }
    }, [dispatch, setIsAuthenticated, navigate, notify]);

    useEffect(() => {
      const token = storage.getToken();

      if (!token) {
        navigate("/login");
      }

      // if not loggedUser in state but token in localstorage
      if (!state.logedUser && token) {
        checkAuthUser();
      }
    }, [state.logedUser, checkAuthUser, navigate]);

    return <WrappedComponent {...props} isAuthenticated={isAuthenticated} />;
  };
}

export default withAuth;
