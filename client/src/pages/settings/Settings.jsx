import { useEffect, useState } from "react";

import { User } from "lucide-react";

import "./settings.css";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

import useAuth from "../../hooks/useAuth";

import { getProfile } from "../../services/authService";


const Settings = () => {

    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
    });


    useEffect(() => {

        loadProfile();

    }, []);


    const loadProfile = async () => {

        try {

            /*
            Get the currently authenticated
            user's profile from the backend.
            */

            const res = await getProfile();

            setProfile({

                name:
                    res.data?.name ||
                    user?.name ||
                    "",

                email:
                    res.data?.email ||
                    user?.email ||
                    "",

            });

        } catch (error) {

            console.error(
                "Failed to load profile:",
                error
            );

            /*
            Fallback to authenticated user
            information if profile API fails.
            */

            setProfile({

                name: user?.name || "",

                email: user?.email || "",

            });

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return <Loader />;

    }


    return (

        <div className="settings-page">

            <PageHeader
                title="Settings"
                subtitle="View your account information."
            />


            <div className="settings-card">


                {/* =================================
                    PROFILE HEADER
                ================================= */}

                <div className="profile-header">

                    <div className="profile-user">

                        <div className="profile-avatar">

                            {profile.name
                                ? profile.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}

                        </div>


                        <div>

                            <div className="profile-name">

                                {profile.name || "User"}

                            </div>


                            <div className="profile-email">

                                {profile.email || "-"}

                            </div>
                            
                            <div className="profile-role">
                                {user?.role || "-"}
                            </div>
                        </div>

                    </div>

                </div>


                {/* =================================
                    ACCOUNT INFORMATION
                ================================= */}

                <h3>

                    <User size={20} />

                    Account Information

                </h3>


                <div className="info-row">

                    <div className="info-label">

                        Full Name

                    </div>

                    <div className="info-value">

                        {profile.name || "-"}

                    </div>

                </div>


                <div className="info-row">

                    <div className="info-label">

                        Email Address

                    </div>

                    <div className="info-value">

                        {profile.email || "-"}

                    </div>

                </div>
                
                <div className="info-row">

                    <div className="info-label">
                        Role
                    </div>

                    <div className="info-value">
                        {user?.role || "-"}
                    </div>
                </div>
            </div>

        </div>

    );

};


export default Settings;