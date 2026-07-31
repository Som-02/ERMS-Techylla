import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { login } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

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

        <div
            style={{
                width: "400px",
                margin: "80px auto",
            }}
        >

            <h1>Admin Login</h1>

            <form onSubmit={submitHandler}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <br />
                <br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>

    );

};

export default Login;