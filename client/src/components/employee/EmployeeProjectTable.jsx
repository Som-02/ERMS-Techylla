import { Link } from "react-router-dom";
import {
    UserPlus,
    Hash,
    FolderKanban,
    Building2,
    Calendar,
    CalendarCheck,
    Activity,
    SlidersHorizontal,
} from "lucide-react";
import { getStatusClass } from "../../utils/getStatusClass";
import ClientDisplay from "../client/ClientDisplay";
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
                        <th>
                            <div className="th-content">
                                <FolderKanban size={14} />
                                <span>Project</span>
                            </div>
                        </th>
                        <th>
                            <div className="th-content">
                                <Building2 size={14} />
                                <span>Client</span>
                            </div>
                        </th>
                        <th>
                            <div className="th-content">
                                <Calendar size={14} />
                                <span>Start Date</span>
                            </div>
                        </th>
                        <th>
                            <div className="th-content">
                                <CalendarCheck size={14} />
                                <span>End Date</span>
                            </div>
                        </th>
                        <th>
                            <div className="th-content">
                                <Activity size={14} />
                                <span>Status</span>
                            </div>
                        </th>
                        <th style={{ textAlign: "center" }}>
                            <div className="th-content" style={{ justifyContent: "center" }}>
                                <SlidersHorizontal size={14} />
                                <span>Action</span>
                            </div>
                        </th>
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
                                    <ClientDisplay client={project.client} logoOnly={true} />
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