import { useEffect, useState } from "react";

import Loader from "../../components/common/Loader";
import StatCard from "../../pages/dashboard/StatCard";

import { getDashboard } from "../../services/dashboardService";

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

        <div>

            <h1 className="text-3xl font-bold mb-6">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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

            <div className="mt-10">

                <h2 className="text-xl font-semibold mb-4">
                    Recent Employees
                </h2>

                <table className="w-full border">

                    <thead>

                        <tr>

                            <th className="border p-2">
                                Employee ID
                            </th>

                            <th className="border p-2">
                                Name
                            </th>

                            <th className="border p-2">
                                Position
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {dashboard.recentEmployees.map((employee) => (

                            <tr key={employee._id}>

                                <td className="border p-2">
                                    {employee.empId}
                                </td>

                                <td className="border p-2">
                                    {employee.name}
                                </td>

                                <td className="border p-2">
                                    {employee.position}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <div className="mt-10">

                <h2 className="text-xl font-semibold mb-4">
                    Active Projects
                </h2>

                <table className="w-full border">

                    <thead>

                        <tr>

                            <th className="border p-2">
                                Project
                            </th>

                            <th className="border p-2">
                                Client
                            </th>

                            <th className="border p-2">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {dashboard.activeProjects.map((project) => (

                            <tr key={project._id}>

                                <td className="border p-2">
                                    {project.name}
                                </td>

                                <td className="border p-2">
                                    {project.client?.name}
                                </td>

                                <td className="border p-2">
                                    {project.status}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default Dashboard;