import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User, Shield } from "lucide-react";
import "./settings.css";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import useAuth from "../../hooks/useAuth";

import {
    getProfile,
    updateProfile,
    changePassword,
} from "../../services/authService";

const Settings = () => {

    const { updateAdmin } = useAuth();

    const [editingProfile, setEditingProfile] = useState(false);
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            const res = await getProfile();

            setProfile({
                name: res.data.name,
                email: res.data.email,
            });

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const profileChangeHandler = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });

    };

    const passwordChangeHandler = (e) => {

        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });

    };

    const saveProfile = async (e) => {

        e.preventDefault();

        try {

            const res = await updateProfile(profile);

            updateAdmin(res.admin);

            setProfile({
                name: res.admin.name,
                email: res.admin.email,
            });

            setEditingProfile(false);

            toast.success(res.message);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to update profile"
            );

        }

    };

    const updatePassword = async (e) => {

        e.preventDefault();

        try {

            const res = await changePassword(passwordData);

            toast.success(res.message);

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to change password"
            );

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <div className="settings-page">

            <PageHeader
                title="Settings"
                subtitle="Manage your account information and security."
            />

            <div className="settings-card">

                <div className="profile-header">

                    <div className="profile-user">

                        <div className="profile-avatar">

                            {profile.name.charAt(0).toUpperCase()}

                        </div>

                        <div>

                            <div className="profile-name">

                                {profile.name}

                            </div>

                            <div className="profile-email">

                                {profile.email}

                            </div>

                        </div>

                    </div>

                </div>

                <h3>

                    <User size={20} />

                    Account Information

                </h3>

                {

                    !editingProfile ? (

                        <>

                            <div className="info-row">

                                <div className="info-label">

                                    Full Name

                                </div>

                                <div className="info-value">

                                    {profile.name}

                                </div>

                            </div>

                            <div className="info-row">

                                <div className="info-label">

                                    Email Address

                                </div>

                                <div className="info-value">

                                    {profile.email}

                                </div>

                            </div>

                            <div className="button-group">

    <button
        className="edit-btn"
        onClick={() => setEditingProfile(true)}
    >
        Edit Profile
    </button>

</div>

                        </>

                    ) : (

                        <form
                            className="settings-form"
                            onSubmit={saveProfile}
                        >

                            <div>

                                <label>

                                    Full Name

                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={profileChangeHandler}
                                />

                            </div>

                            <div>

                                <label>

                                    Email Address

                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={profileChangeHandler}
                                />

                            </div>

                            <div className="button-group">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {

                                        loadProfile();

                                        setEditingProfile(false);

                                    }}
                                >

                                    Cancel

                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                >

                                    Save Changes

                                </button>

                            </div>

                        </form>

                    )

                }

            </div>

            <div className="settings-card">

                <h3>

                    <Shield size={20} />

                    Change Password

                </h3>

                <form
                    className="settings-form"
                    onSubmit={updatePassword}
                >

                    <div>

                        <label>

                            Current Password

                        </label>

                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={passwordChangeHandler}
                        />

                    </div>

                    <div>

                        <label>

                            New Password

                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={passwordChangeHandler}
                        />

                    </div>

                    <div>

                        <label>

                            Confirm Password

                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={passwordChangeHandler}
                        />

                    </div>

                    <div className="button-group">

                        <button
                            className="save-btn"
                            type="submit"
                        >

                            Update Password

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default Settings;