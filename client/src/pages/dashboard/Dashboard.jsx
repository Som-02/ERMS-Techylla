import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    FolderKanban
} from "lucide-react";

import Loader from "../../components/common/Loader";
import StatCard from "./StatCard";
import { getDashboard } from "../../services/dashboardService";

import "./dashboard.css";

const Dashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const res = await getDashboard();

            setDashboard(res.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <div className="dashboard">

            <div className="dashboard-header">

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px"
                    }}
                >

                    <div className="dashboard-icon">

                        <LayoutDashboard
                            size={30}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <h1 className="dashboard-title">
                            Dashboard
                        </h1>

                        <p className="dashboard-subtitle">
                            Welcome back! Here's an overview of your
                            organization.
                        </p>

                    </div>

                </div>

            </div>

            <div className="stats-grid">

                <StatCard
                    title="Employees"
                    value={dashboard.totalEmployees}
                />

                <StatCard
                    title="Clients"
                    value={dashboard.totalClients}
                />

                <StatCard
                    title="Projects"
                    value={dashboard.totalProjects}
                />

            </div>

            {/* Recent Employees */}

            <section className="section">

                <div className="section-header">

                    <h2 className="section-title">

                        Recent Employees

                    </h2>

                </div>

                {

                    dashboard.recentEmployees.length === 0 ? (

                        <div className="empty-state">

                            No recent employees found.

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="dashboard-table">

                                <thead>

                                    <tr>

                                        <th>

                                            Employee ID

                                        </th>

                                        <th>

                                            Name

                                        </th>

                                        <th>

                                            Position

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        dashboard.recentEmployees.map(employee => (

                                            <tr
                                                key={employee._id}
                                            >

                                                <td>

                                                    <span className="emp-id">

                                                        {employee.empId}

                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="employee-cell">

                                                        <div className="employee-avatar">

                                                            {

                                                                employee.name
                                                                    .charAt(0)
                                                                    .toUpperCase()

                                                            }

                                                        </div>

                                                        <div>

                                                            <strong>

                                                                {employee.name}

                                                            </strong>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td>

                                                    {employee.position}

                                                </td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        </div>

                    )

                }

            </section>
                        {/* Active Projects */}

            <section className="section">

                <div className="section-header">

                    <h2 className="section-title">

                        Active Projects

                    </h2>

                </div>

                {

                    dashboard.activeProjects.length === 0 ? (

                        <div className="empty-state">

                            No active projects found.

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="dashboard-table">

                                <thead>

                                    <tr>

                                        <th>

                                            Project

                                        </th>

                                        <th>

                                            Client

                                        </th>

                                        <th>

                                            Status

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        dashboard.activeProjects.map(project => (

                                            <tr
                                                key={project._id}
                                            >

                                                <td>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "10px"
                                                        }}
                                                    >

                                                        <FolderKanban
                                                            size={18}
                                                            className="text-purple-600"
                                                        />

                                                        <strong>

                                                            {project.name}

                                                        </strong>

                                                    </div>

                                                </td>

                                                <td>

                                                    {project.client?.name || "-"}

                                                </td>

                                                <td>

                                                    <span
                                                        className={`status ${
                                                            project.status === "Active"
                                                                ? "active"
                                                                : "inactive"
                                                        }`}
                                                    >

                                                        <span className="status-dot"></span>

                                                        {project.status}

                                                    </span>

                                                </td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        </div>

                    )

                }

            </section>

        </div>

    );

};

export default Dashboard;