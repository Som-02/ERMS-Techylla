import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

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
import ClientDisplay from "../../components/client/ClientDisplay";

import {
    getMyEmployee
} from "../../services/employeeService";

import {
    formatDate
} from "../../utils/formatDate";

import "../employees/employeeDetails.css";

const EmployeeDetails = () => {

    const [employee, setEmployee] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        loadEmployee();

    }, []);

    const loadEmployee = async () => {

        try {

            const res =
                await getMyEmployee();

            setEmployee(res.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    if (!employee) {

        return (
            <h2>
                Employee not found.
            </h2>
        );

    }

    return (

        <div className="employee-details">

            <Link to="/employee">
                ← Back to Employee Master
            </Link>

            <h2>
                {employee.name}
            </h2>

            <hr />

            <p>
                <strong>
                    Employee ID:
                </strong>

                <span className="emp-id">{employee.empId}</span>
            </p>

            <p>
                <strong>
                    Email:
                </strong>

                {employee.email}
            </p>

            <p>
                <strong>
                    Mobile:
                </strong>

                {employee.mobile || "-"}
            </p>

            <p>
                <strong>
                    Location:
                </strong>

                {employee.location || "-"}
            </p>

            <p>
                <strong>
                    Position:
                </strong>

                {employee.position || "-"}
            </p>

            <p>
                <strong>
                    Experience:
                </strong>

                {employee.experience || 0} Years
            </p>

            <p>
                <strong>
                    Reporting Manager:
                </strong>

                {employee.reportingManager?.name ||
                    employee.reportingManager ||
                    "-"}
            </p>

            <hr />

            <h3>
                Roles
            </h3>

            {employee.skills?.length === 0 ? (

                <p>
                    No Skills Added
                </p>

            ) : (

                <ul>

                    {employee.skills.map(
                        (skill, index) => (

                            <li key={index}>

                                {skill.skill}
                                {" "}
                                ({skill.rating}/5)

                            </li>

                        )
                    )}

                </ul>

            )}

            <hr />

            <h3>
                Assignments
            </h3>

            <table>

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

                    {employee.assignments?.length === 0 ? (

                        <tr>

                            <td
                                colSpan="7"
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                No assignments found.
                            </td>

                        </tr>

                    ) : (

                        employee.assignments.map(
                            (assignment, index) => (

                                <tr key={index}>

                                    <td style={{ textAlign: "left" }}>
                                        <ClientDisplay client={assignment.client || assignment.clientName} />
                                    </td>

                                    <td style={{ textAlign: "left" }}>
                                        {assignment.project?.name ||
                                            "-"}
                                    </td>

                                    <td style={{ textAlign: "left" }}>
                                        {assignment.role?.name ||
                                            "-"}
                                    </td>

                                    <td style={{ textAlign: "left" }}>
                                        {assignment.location ||
                                            "-"}
                                    </td>

                                    <td style={{ textAlign: "left" }}>
                                        {assignment.startDate
                                            ? formatDate(
                                                assignment.startDate
                                            )
                                            : "-"}
                                    </td>

                                    <td style={{ textAlign: "left" }}>
                                        {assignment.endDate
                                            ? formatDate(
                                                assignment.endDate
                                            )
                                            : "-"}
                                    </td>

                                    <td style={{ textAlign: "left" }}>
                                        {assignment.allocation !== null &&
                                        assignment.allocation !== undefined &&
                                        assignment.allocation !== ""
                                            ? `${assignment.allocation}%`
                                            : "-"}
                                    </td>

                                </tr>

                            )
                        )

                    )}

                </tbody>

            </table>

        </div>

    );

};

export default EmployeeDetails;