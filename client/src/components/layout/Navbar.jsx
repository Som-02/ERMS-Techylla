import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {

    const { user } = useAuth();

    const [activeNow, setActiveNow] = useState(false);
    const [elapsed, setElapsed] = useState("");

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("ehrms_theme") || "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("ehrms_theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    useEffect(() => {

    if (!user) return;

    /*
    ==========================================
    CURRENT LOGIN SESSION
    ==========================================
    */

    const sessionKey = "ehrms_login_session";

    let sessionLoginTime =
        sessionStorage.getItem(sessionKey);

    /*
    If this is a completely new login,
    create the session timestamp.
    */

    if (!sessionLoginTime) {

        sessionLoginTime =
            Date.now().toString();

        sessionStorage.setItem(
            sessionKey,
            sessionLoginTime
        );

    }

    const loginTime =
        Number(sessionLoginTime);

    const calculateStatus = () => {

        const secondsSinceLogin =
            Math.floor(
                (Date.now() - loginTime) / 1000
            );

        /*
        ==========================================
        AFTER 10 SECONDS
        ==========================================
        */

        if (secondsSinceLogin >= 10) {

            setActiveNow(true);
            setElapsed("");

            return;

        }

        /*
        ==========================================
        FIRST 10 SECONDS
        Calculate time since previous logout
        ==========================================
        */

        if (!user.lastLogoutAt) {

            setActiveNow(true);
            setElapsed("");

            return;

        }

        const lastLogout =
            new Date(
                user.lastLogoutAt
            ).getTime();

        const difference =
            Math.floor(
                (Date.now() - lastLogout) / 1000
            );

        setActiveNow(false);

        const minutes =
            Math.floor(difference / 60);

        const hours =
            Math.floor(minutes / 60);

        const days =
            Math.floor(hours / 24);

        if (days > 0) {

            setElapsed(
                `${days} day${days !== 1 ? "s" : ""} ago`
            );

        } else if (hours > 0) {

            setElapsed(
                `${hours} hour${hours !== 1 ? "s" : ""} ago`
            );

        } else if (minutes > 0) {

            setElapsed(
                `${minutes} min${minutes !== 1 ? "s" : ""} ago`
            );

        } else {

            setElapsed(
                `${difference} sec${difference !== 1 ? "s" : ""} ago`
            );

        }

    };

    calculateStatus();

    const interval =
        setInterval(
            calculateStatus,
            1000
        );

    return () => {

        clearInterval(interval);

    };

}, [user]);

    return (

        <header className="navbar">

            <h2>
                Human Resource Management System
            </h2>

            <div className="navbar-user-container">

                <div className="user-greeting">
                    Welcome,&nbsp;

                    <strong>
                        {user?.name}
                    </strong>
                </div>

                <div className="login-status-row">

                    <div className="login-status">

                        {activeNow ? (

                            <>
                                <span className="active-dot"></span>
                                Active Now
                            </>

                        ) : (

                            `Active ${elapsed}`

                        )}

                    </div>

                    <button
                        type="button"
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? (
                            <Sun className="theme-icon sun" size={15} />
                        ) : (
                            <Moon className="theme-icon moon" size={15} />
                        )}
                    </button>

                </div>

            </div>

        </header>

    );

};

export default Navbar;