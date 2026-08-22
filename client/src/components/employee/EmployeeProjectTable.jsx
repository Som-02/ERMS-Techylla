import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { getStatusClass } from "../../utils/getStatusClass";
import "../project/project.css";

const EmployeeProjectTable = ({ projects }) => {
    return (
        <div className="table-wrapper">
            <table className="dashboard-table">
                <colgroup>
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "24%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "17%" }} />
                </colgroup>

                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Project</th>
                        <th>Client</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {projects.length === 0 ? (
                        <tr>
                            <td colSpan="7">No assigned projects found.</td>
                        </tr>
                    ) : (
                        projects.map((project, index) => (
                            <tr key={project._id}>
                                <td>{index + 1}</td>

                                <td className="project-name">
                                    <Link
                                        to={`/employee/projects/${project._id}`}
                                        className="project-name-link"
                                        title="View Project Details"
                                    >
                                        {project.name}
                                    </Link>
                                </td>

                                <td>
                                    {project.client?.logo ? (
                                        <img
                                            src={project.client.logo}
                                            alt={project.client.name}
                                            style={{
                                                width: "60px",
                                                height: "45px",
                                                objectFit: "contain",
                                            }}
                                        />
                                    ) : (
                                        project.client?.name || "-"
                                    )}
                                </td>

                                <td>
                                    {project.startDate
                                        ? project.startDate.split("T")[0]
                                        : "-"}
                                </td>

                                <td>
                                    {project.endDate
                                        ? project.endDate.split("T")[0]
                                        : "-"}
                                </td>

                                <td>
                                    <span
                                        className={`status ${getStatusClass(project.status)}`}
                                    >
                                        <span className="status-dot"></span>
                                        {project.status}
                                    </span>
                                </td>

                                <td style={{ textAlign: "center" }}>
                                    {project.canManageAssignments ? (
                                        <Link
                                            to={`/employee/projects/${project._id}/assign`}
                                            className="project-btn project-assign-btn"
                                            title="Assign Employees"
                                        >
                                            <UserPlus size={16} />
                                            <span>Assign</span>
                                        </Link>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeProjectTable;