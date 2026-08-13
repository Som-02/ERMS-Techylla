import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import {
    useMsal,
} from "@azure/msal-react";

import {
    InteractionStatus,
} from "@azure/msal-browser";

import "./login.css";
import microsoftLogo from "../../assets/microsoft-logo.png";
import logo from "../../assets/vite.svg";
import { loginRequest } from "../../config/authConfig";
import {
    microsoftLogin,
} from "../../services/authService";
const Login = () => {

    const navigate = useNavigate();
const { loginUser } = useAuth();
    const {
        instance,
        accounts,
        inProgress,
    } = useMsal();

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (
            inProgress !== InteractionStatus.None
        ) {
            return;
        }

        const handleRedirect = async () => {

    try {

        const response =
            await instance.handleRedirectPromise();

        if (!response) {
            return;
        }
        setLoading(true);
        console.log(
            "Microsoft login response:",
            response
        );

        const account = response.account;

        console.log(
            "Microsoft account:",
            account
        );

        const claims =
            response.idTokenClaims;

        console.log(
            "Microsoft ID token claims:",
            claims
        );

        const roles =
            claims?.roles || [];

        console.log(
            "Microsoft roles:",
            roles
        );

        console.log(
            "✅ ADMINISTRATOR ROLE VERIFIED"
        );

        // Send Microsoft ID token to your backend
        const backendResponse =
            await microsoftLogin(
                response.idToken
            );

        // Store YOUR application's JWT + admin data
       loginUser(
    backendResponse.user,
    backendResponse.token
);

        toast.success(
            "Microsoft login successful!"
        );

        if (
    backendResponse.user.role === "Administrator"
) {

    navigate("/dashboard");

} else if (
    backendResponse.user.role === "Employee"
) {

    navigate("/employees");

}

    } catch (error) {

        console.error(
            "Microsoft redirect login error:",
            error
        );

        toast.error(
            error?.errorMessage ||
            error?.message ||
            "Microsoft login failed"
        );
        setLoading(false);
    }
};

        handleRedirect();

    }, [
        instance,
        inProgress,
        navigate,
    ]);


    const handleMicrosoftLogin = async () => {

        if (
            inProgress !== InteractionStatus.None
        ) {
            return;
        }

        try {

            setLoading(true);

            await instance.loginRedirect(
                loginRequest
            );

        } catch (error) {

            console.error(
                "Microsoft login error:",
                error
            );

            toast.error(
                error?.errorMessage ||
                error?.message ||
                "Microsoft login failed"
            );

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">

                    <img
                        src={logo}
                        alt="Techylla Logo"
                        className="login-logo-img"
                    />

                </div>


                <h1 className="login-title">

                    Human Resource
                    <br />
                    Management System

                </h1>


                <p className="login-subtitle">

                    Sign in using your company
                    Microsoft account

                </p>


                <button
    className="login-btn"
    type="button"
    onClick={handleMicrosoftLogin}
    disabled={
        loading ||
        inProgress !== InteractionStatus.None
    }
>
    {loading ? (
        "Signing in..."
    ) : (
        <>
            <img
                src={microsoftLogo}
                alt=""
                className="microsoft-logo"
            />

            <span>
                Sign in with Microsoft
            </span>
        </>
    )}
</button>


                <div className="login-footer">

                    Human Resource Management System

                </div>

            </div>

        </div>

    );

};

export default Login;