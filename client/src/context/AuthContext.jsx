import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [admin, setAdmin] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedAdmin = localStorage.getItem("admin");

        if (storedAdmin) {

            setAdmin(JSON.parse(storedAdmin));

        }

        setLoading(false);

    }, []);

    const loginUser = (adminData, token) => {

        localStorage.setItem("token", token);

        localStorage.setItem("admin", JSON.stringify(adminData));

        setAdmin(adminData);

    };

    // NEW
    const updateAdmin = (updatedAdmin) => {

        localStorage.setItem("admin", JSON.stringify(updatedAdmin));

        setAdmin(updatedAdmin);

    };

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("admin");

        setAdmin(null);

    };

    return (

        <AuthContext.Provider

            value={{

                admin,

                loginUser,

                updateAdmin, // NEW

                logout,

                loading,

                isAuthenticated: !!admin,

            }}

        >

            {children}

        </AuthContext.Provider>

    );

};

export default AuthProvider;