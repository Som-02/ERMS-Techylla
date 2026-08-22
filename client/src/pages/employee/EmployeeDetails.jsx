import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

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

                {employee.empId}
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

                        <th>Client</th>

                        <th>Project</th>

                        <th>Role</th>

                        <th>Location</th>

                        <th>Start Date</th>

                        <th>End Date</th>

                        <th>Allocation</th>

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

                                    <td style={{
    textAlign: "left",
}}>
    <ClientDisplay client={assignment.client || assignment.clientName} />
</td>


                                    <td>
                                        {assignment.project?.name ||
                                            "-"}
                                    </td>

                                    <td>
                                        {assignment.role?.name ||
                                            "-"}
                                    </td>

                                    <td>
                                        {assignment.location ||
                                            "-"}
                                    </td>

                                    <td>
                                        {assignment.startDate
                                            ? formatDate(
                                                assignment.startDate
                                            )
                                            : "-"}
                                    </td>

                                    <td>
                                        {assignment.endDate
                                            ? formatDate(
                                                assignment.endDate
                                            )
                                            : "-"}
                                    </td>

                                    <td style={{ textAlign: "right" }}>
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