import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Building2,
    FolderKanban,
    Award,
    MapPin,
    Calendar,
    CalendarCheck,
    Clock,
} from "lucide-react";
import Loader from "../../components/common/Loader";
import { getEmployee } from "../../services/employeeService";
import "../../pages/employees/employeeDetails.css";
import { formatDate } from "../../utils/formatDate";
import ClientDisplay from "../../components/client/ClientDisplay";

const EmployeeDetails = () => {
    const { id } = useParams();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmployee();
    }, [id]);

    const loadEmployee = async () => {
        try {
            const res = await getEmployee(id);
            setEmployee(res.data);
        } catch (error) {
            console.error("Failed to fetch employee details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!employee) {
        return (
            <div className="employee-details">
                <Link className="back-link" to="/employees">
                    ← Back to Employees
                </Link>
                <h2>Employee Not Found</h2>
            </div>
        );
    }

    const positionName =
        typeof employee.position === "object"
            ? employee.position?.name
            : employee.position || "-";

    const managerName =
        typeof employee.reportingManager === "object"
            ? employee.reportingManager?.name
            : employee.reportingManager || "-";

    return (
        <div className="employee-details">
            <Link className="back-link" to="/employees">
                ← Back to Employees
            </Link>

            <div className="profile-card">
                <h2>{employee.name}</h2>
                <div className="profile-details-grid">
                    <p>
                        <strong>Employee ID:</strong> <span className="emp-id">{employee.empId || employee.employeeId || "-"}</span>
                    </p>
                    <p>
                        <strong>Email:</strong> {employee.email || "-"}
                    </p>
                    <p>
                        <strong>Mobile:</strong> {employee.mobile || "-"}
                    </p>
                    <p>
                        <strong>Location:</strong> {employee.location || "-"}
                    </p>
                    <p>
                        <strong>Position:</strong> {positionName}
                    </p>
                    <p>
                        <strong>Experience:</strong> {employee.experience ? `${employee.experience} Years` : "-"}
                    </p>
                    <p>
                        <strong>Reporting Manager:</strong> {managerName}
                    </p>
                </div>
            </div>

            {/* Skills Section */}
            {employee.skills && employee.skills.length > 0 && (
                <div className="profile-card skills-summary-card" style={{ marginTop: "20px" }}>
                    <h3>Roles & Skills</h3>
                    <ul className="skills-list">
                        {employee.skills.map((skill, index) => (
                            <li key={index}>
                                <strong>{skill.skill || skill.name}</strong> ({skill.rating}/5)
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Assignments Section */}
            <div className="assignments-card" style={{ marginTop: "20px" }}>
                <h3>Projects Assigned</h3>

                {!employee.assignments || employee.assignments.length === 0 ? (
                    <p className="no-assignments">No projects assigned.</p>
                ) : (
                    <div className="employee-table-card">
                        <table className="employee-table">
                            <colgroup>
                                <col style={{ width: "15%" }} />
                                <col style={{ width: "25%" }} />
                                <col style={{ width: "15%" }} />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "11%" }} />
                                <col style={{ width: "10%" }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-content">
                                            <Building2 size={15} />
                                            <span>Client</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <FolderKanban size={15} />
                                            <span>Project</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <Award size={15} />
                                            <span>Role</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <MapPin size={15} />
                                            <span>Location</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <Calendar size={15} />
                                            <span>Start Date</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <CalendarCheck size={15} />
                                            <span>End Date</span>
                                        </div>
                                    </th>
                                    <th style={{ textAlign: "left" }}>
                                        <div className="th-content">
                                            <Clock size={14} />
                                            <span>Allocation</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {employee.assignments.map((assignment, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: "left" }}>
                                            <ClientDisplay
                                                client={assignment.client || assignment.clientName}
                                            />
                                        </td>
                                        <td style={{ textAlign: "left" }}>
                                            {assignment.project?.name || assignment.projectName || "-"}
                                        </td>
                                        <td style={{ textAlign: "left" }}>
                                            {assignment.role?.name || assignment.role || "-"}
                                        </td>
                                        <td style={{ textAlign: "left" }}>
                                            {assignment.location || "-"}
                                        </td>
                                        <td style={{ textAlign: "left" }}>
                                            {assignment.startDate ? formatDate(assignment.startDate) : "-"}
                                        </td>
                                        <td style={{ textAlign: "left" }}>
                                            {assignment.endDate ? formatDate(assignment.endDate) : "-"}
                                        </td>
                                        <td style={{ textAlign: "left" }}>
                                            {assignment.allocation !== null &&
                                            assignment.allocation !== undefined &&
                                            assignment.allocation !== ""
                                                ? `${assignment.allocation}%`
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeDetails;