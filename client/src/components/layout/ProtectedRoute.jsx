import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({
    children,
    allowedRoles
}) => {

    const {
        loading,
        isAuthenticated,
        user
    } = useAuth();

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!isAuthenticated) {

        return (

            <Navigate
                to="/"
                replace
            />

        );

    }

    /*
    ==========================================
    ROLE PROTECTION
    ==========================================
    */

    if (
        allowedRoles &&
        !allowedRoles.includes(user?.role)
    ) {

        if (
            user?.role === "Employee"
        ) {

            return (

                <Navigate
                    to="/employee"
                    replace
                />

            );

        }

        if (
            user?.role === "Administrator"
        ) {

            return (

                <Navigate
                    to="/dashboard"
                    replace
                />

            );

        }

        return (

            <Navigate
                to="/"
                replace
            />

        );

    }

    return children;

};

export default ProtectedRoute;