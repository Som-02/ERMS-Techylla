import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
    }, []);

    const loadEmployee = async () => {
        try {
            const res = await getEmployee(id);
            setEmployee(res.data);
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    if (loading) {
        return <Loader />;
    }

    if (!employee) {
        return <h2>Employee not found.</h2>;
    }

    return (
        <div className="employee-details">

            <Link to="/employees">
                ← Back to Employees
            </Link>

            <h2>{employee.name}</h2>

            <hr />

            <p><strong>Employee ID:</strong> {employee.empId}</p>
<p><strong>Email:</strong> {employee.email}</p>
<p><strong>Mobile:</strong> {employee.mobile}</p>
<p>
    <strong>Location:</strong>{" "}
    {employee.location || "-"}
</p>
{/* <p><strong>WWID:</strong> {employee.wwid}</p> */}
<p><strong>Position:</strong> {employee.position}</p>
<p><strong>Experience:</strong> {employee.experience} Years</p>
<p>
    <strong>Reporting Manager:</strong>{" "}
    {employee.reportingManager?.name ||
        employee.reportingManager ||
        "-"}
</p>

            <hr />

            <h3>Roles</h3>

{employee.skills.length === 0 ? (
    <p>No Skills Added</p>
) : (
    <ul>
        {employee.skills.map((skill, index) => (
            <li key={index}>
                {skill.skill} ({skill.rating}/5)
            </li>
        ))}
    </ul>
)}

            <hr />

            <h3>Assignments</h3>

<table border="1" cellPadding="10">
<colgroup>
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "20%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
    </colgroup>
    <thead>
        <tr>
            <th style={{
        textAlign: "left",
    }}>Client</th>
            <th style={{
        textAlign: "left",
    }}>Project</th>
    <th style={{ textAlign: "left" }}>Role</th>
        <th style={{ textAlign: "left" }}>Location</th>
            <th style={{
        textAlign: "left",
    }}>Start Date</th>
            <th style={{
        textAlign: "left",
    }}>End Date</th>
            <th style={{
        textAlign: "left",
    }}>Allocation</th>
        </tr>
    </thead>

    <tbody>

        {employee.assignments.map((assignment, index) => (

            <tr key={index}>

                <td style={{
    textAlign: "left",
}}>
    {assignment.client?.logo ? (
        <img
            src={assignment.client.logo}
            alt={assignment.client.name || "Client"}
            className="employee-client-logo"
        />
    ) : (
        assignment.client?.name ||
        assignment.clientName ||
        "-"
    )}
</td>

                <td style={{
        textAlign: "left",
    }}>
                    {assignment.project?.name ||
                        assignment.projectName ||
                        "-"}
                </td>
<td style={{ textAlign: "left" }}>
    {assignment.role?.name || "-"}
</td>

<td style={{ textAlign: "left" }}>
    {assignment.location || "-"}
</td>
                <td style={{
        textAlign: "left",
    }}>
    {assignment.startDate
        ? formatDate(assignment.startDate)
        : "-"}
</td>

<td style={{
        textAlign: "left",
    }}>
    {assignment.endDate
        ? formatDate(assignment.endDate)
        : "-"}
</td>
<td style={{
        textAlign: "right",
    }}>{assignment.allocation || "-"}</td>
            </tr>

        ))}

    </tbody>

</table>

        </div>
    );
};

export default EmployeeDetails;