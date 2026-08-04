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

        <span>Project Start Date</span>

        <strong>

            {project.startDate
                ? new Date(project.startDate).toLocaleDateString(
                      "en-IN",
                      {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                      }
                  )
                : "-"}

        </strong>

    </div>

    <div className="detail">

        <span>Project End Date</span>

        <strong>

            {project.endDate
                ? new Date(project.endDate).toLocaleDateString(
                      "en-IN",
                      {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                      }
                  )
                : "-"}

        </strong>

    </div>

    <div className="detail">

        <span>Employees Assigned</span>

        <strong>

            {employees.length}

        </strong>

    </div>
    <div className="detail">

    <span>Role</span>

    <strong>

        {project.requiredSkills?.length > 0
            ? project.requiredSkills
                  .map((skill) => skill.name)
                  .join(", ")
            : "-"}

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

    <th>Start Date</th>

    <th>End Date</th>

    <th>Allocation</th>

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

    {employee.startDate
        ? new Date(employee.startDate).toLocaleDateString(
              "en-IN",
              {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
              }
          )
        : "-"}

</td>

<td>

    {employee.endDate
        ? new Date(employee.endDate).toLocaleDateString(
              "en-IN",
              {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
              }
          )
        : "-"}

</td>

<td>

    {employee.allocation}%

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