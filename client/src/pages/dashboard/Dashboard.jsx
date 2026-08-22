import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    IdCard,
    User,
    Briefcase,
    MapPin,
} from "lucide-react";

import Loader from "../../components/common/Loader";
import StatCard from "./StatCard";
import { getDashboard } from "../../services/dashboardService";
import ProjectStatusTable from "../../components/dashboard/ProjectStatusTable";
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
<colgroup>
  <col style={{ width: "25%" }} />
  <col style={{ width: "40%" }} />
  <col style={{ width: "20%" }} />
  <col style={{ width: "15%" }} />
    </colgroup>
                                <thead>

                                    <tr>

                                        <th>Employee ID</th>

                                        <th>
                                            <div className="th-content">
                                                <User size={14} />
                                                <span>Name</span>
                                            </div>
                                        </th>

                                        <th>
                                            <div className="th-content">
                                                <Briefcase size={14} />
                                                <span>Position</span>
                                            </div>
                                        </th>
                                        
                                        <th>
                                            <div className="th-content">
                                                <MapPin size={14} />
                                                <span>Location</span>
                                            </div>
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

                                                        {/* <div className="employee-avatar">

                                                            {

                                                                employee.name
                                                                    .charAt(0)
                                                                    .toUpperCase()

                                                            }

                                                        </div> */}

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

                                                <td>

                                                    {employee.location}

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
                        {/* Lead Projects */}

<ProjectStatusTable

    title="Lead Projects"

    projects={dashboard.leadProjects}

/>

{/* Pipeline Projects */}

<ProjectStatusTable

    title="Pipeline Projects"

    projects={dashboard.pipelineProjects}

/>

{/* Active Projects */}

<ProjectStatusTable

    title="Active Projects"

    projects={dashboard.activeProjects}

/>

        </div>

    );

};

export default Dashboard;