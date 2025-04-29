import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useStateValue } from 'state';
import { LogedUser } from 'types';
import { Box } from '@mui/material';

const checkAdmin = (loggedUser: LogedUser) => {
    return loggedUser.role === "ADMIN"
}

const ProtectedRoute = () => {
    const [state, dispatch] = useStateValue();

    if (state.logedUser && !checkAdmin(state.logedUser)) {
        return <Navigate to="/shop" replace />;
    }

    return (
        <Box>
            <Outlet />
        </Box>
    )
}

export default ProtectedRoute
