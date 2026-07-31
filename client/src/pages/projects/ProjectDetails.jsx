import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Loader from "../../components/common/Loader";

import { getProject } from "../../services/projectService";

import "./projectDetails.css";

const ProjectDetails = () => {

    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadProject();

    }, []);

    const loadProject = async () => {

        try {

            const res = await getProject(id);

            setProject(res.data.project);

            setEmployees(res.data.employees);

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

        <div className="project-details">

            <Link
                className="back-link"
                to="/projects"
            >
                ← Back to Projects
            </Link>

            <h1>

                {project.name}

            </h1>

            <div className="project-card">

                <div className="detail">

                    <span>Client</span>

                    <strong>

                        {project.client?.name}

                    </strong>

                </div>

                <div className="detail">

                    <span>Status</span>

                    <strong>

                        {project.status}

                    </strong>

                </div>

                <div className="detail">

                    <span>Employees Assigned</span>

                    <strong>

                        {employees.length}

                    </strong>

                </div>

            </div>

            <h2>

                Assigned Employees

            </h2>

            {

                employees.length === 0 ?

                (

                    <div className="empty">

                        No employees assigned.

                    </div>

                ) :

                (

                    <table className="employee-table">

                        <thead>

                            <tr>

                                <th>Employee ID</th>

                                <th>Name</th>

                                <th>Position</th>

                                <th>Experience</th>

                                <th>End Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                employees.map(employee => (

                                    <tr key={employee._id}>

                                        <td>

                                            {employee.empId}

                                        </td>

                                        <td>

                                            {employee.name}

                                        </td>

                                        <td>

                                            {employee.position}

                                        </td>

                                        <td>

                                            {employee.experience} Years

                                        </td>

                                        <td>

                                            {

                                                employee.endDate

                                                ?

                                                new Date(employee.endDate).toLocaleDateString(

                                                    "en-IN",

                                                    {

                                                        day:"2-digit",

                                                        month:"short",

                                                        year:"numeric",

                                                    }

                                                )

                                                :

                                                "-"

                                            }

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

        </div>

    );

};

export default ProjectDetails;