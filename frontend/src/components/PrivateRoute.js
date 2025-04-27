import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children })
{
    const token = localStorage.getItem("access_token");
    return token ? children : <Navigate to="/owner/login" />;
}

export default PrivateRoute;
