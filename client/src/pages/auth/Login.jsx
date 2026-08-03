import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./login.css";
import { login } from "../../services/authService";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/image.png";
const Login = () => {

    const navigate = useNavigate();

    const { loginUser } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const submitHandler = async (e) => {

        e.preventDefault();

        try {

            const res = await login({
                email,
                password,
            });

            loginUser(res.admin, res.token);

            toast.success("Login Successful");

            if (res.mustChangePassword) {

                navigate("/change-password");

            } else {

                navigate("/dashboard");

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Login Failed"
            );

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

                Human Resource Management System

            </h1>

            <p className="login-subtitle">

                Sign in to continue to your dashboard

            </p>

            <form
                className="login-form"
                onSubmit={submitHandler}
            >

                <div className="login-group">

                    <label>

                        Email Address

                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />

                </div>

                <div className="login-group">

                    <label>

                        Password

                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                </div>

                <button
                    className="login-btn"
                    type="submit"
                >

                    Sign In

                </button>

            </form>

            <div className="login-footer">

                Employee Resource Management System

            </div>

        </div>

    </div>

);

};

export default Login;