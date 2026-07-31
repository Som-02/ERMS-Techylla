import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { changePassword } from "../../services/authService";

const ChangePassword = () => {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const submitHandler = async (e) => {

        e.preventDefault();

        try {

            await changePassword({
                currentPassword,
                newPassword,
                confirmPassword,
            });

            toast.success("Password Changed");

            navigate("/dashboard");

        } catch (error) {

            toast.error(
                error.response?.data?.message
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

            <h1>Change Password</h1>

            <form onSubmit={submitHandler}>

                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(e.target.value)
                    }
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(e.target.value)
                    }
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                />

                <br />
                <br />

                <button type="submit">
                    Change Password
                </button>

            </form>

        </div>

    );

};

export default ChangePassword;