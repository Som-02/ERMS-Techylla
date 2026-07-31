import {
    Users,
    Building2,
    FolderKanban
} from "lucide-react";

import "./dashboard.css";

const StatCard = ({ title, value }) => {

    const getIcon = () => {

        switch (title) {

            case "Employees":
                return (
                    <Users
                        size={28}
                        className="text-blue-600"
                    />
                );

            case "Clients":
                return (
                    <Building2
                        size={28}
                        className="text-green-600"
                    />
                );

            case "Projects":
                return (
                    <FolderKanban
                        size={28}
                        className="text-purple-600"
                    />
                );

            default:
                return null;

        }

    };

    return (

        <div className="dashboard-card">

            <div className="dashboard-card-top">

                <div>

                    <p className="dashboard-card-title">
                        {title}
                    </p>

                    <h2 className="dashboard-card-value">
                        {value}
                    </h2>

                    <p className="dashboard-card-subtitle">

    {
        title === "Employees"
            ? "Registered Employees"
            : title === "Clients"
            ? "Business Clients"
            : "Ongoing Projects"
    }

</p>

                </div>

                <div className="dashboard-icon">

                    {getIcon()}

                </div>

            </div>

        </div>

    );

};

export default StatCard;