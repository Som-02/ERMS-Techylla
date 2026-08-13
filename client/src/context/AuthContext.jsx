import {
    createContext,
    useEffect,
    useState
} from "react";
import { useMsal } from "@azure/msal-react";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const { instance } = useMsal();
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        /*
        Support old admin storage temporarily
        */

        if (storedUser) {

            setUser(JSON.parse(storedUser));

        } else {

            const storedAdmin =
                localStorage.getItem("admin");

            if (storedAdmin) {

                const admin =
                    JSON.parse(storedAdmin);

                setUser(admin);

            }

        }

        setLoading(false);

    }, []);

    const loginUser = (userData, token) => {

        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        /*
        Keep this temporarily so existing
        parts of the application don't break.
        */

        if (
            userData.role === "Administrator"
        ) {

            localStorage.setItem(
                "admin",
                JSON.stringify(userData)
            );

        }

        setUser(userData);

    };

    const updateUser = (updatedUser) => {

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        if (
            updatedUser.role === "Administrator"
        ) {

            localStorage.setItem(
                "admin",
                JSON.stringify(updatedUser)
            );

        }

        setUser(updatedUser);

    };

    /*
    Keep updateAdmin temporarily because
    existing Settings code may use it.
    */

    const updateAdmin = (updatedAdmin) => {

        updateUser(updatedAdmin);

    };

    const logout = async () => {

    // Clear our application session
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");

    setUser(null);

    // Logout from Microsoft / Entra ID
    await instance.logoutRedirect();

};

    return (

        <AuthContext.Provider
            value={{

                user,

                admin:
                    user?.role === "Administrator"
                        ? user
                        : null,

                loginUser,

                updateUser,

                updateAdmin,

                logout,

                loading,

                isAuthenticated:
                    !!user,

                isAdmin:
                    user?.role === "Administrator",

                isEmployee:
                    user?.role === "Employee"

            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

export default AuthProvider;