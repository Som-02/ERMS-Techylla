import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
const EmployeeRow = ({
    employee,
    onDelete,
}) => {

    const assignmentCount = employee.assignments?.length || 0;

    let rowClass = "";

    if (assignmentCount > 4) {

        rowClass = "employee-overloaded";

    } else if (assignmentCount < 2) {

        rowClass = "employee-underutilized";

    }

    return (

        <tr className={rowClass}>

            <td style={{
        textAlign: "left",
    }}>{employee.empId}</td>

            <td style={{
        textAlign: "left",
    }}>{employee.name}</td>

            <td style={{
        textAlign: "left",
    }}>{employee.position}</td>

            {/* <td>{employee.email}</td> */}

            {/* <td>

                {employee.experience} Years

            </td> */}

            {/* <td>

                {employee.reportingManager?.name ||
                    employee.reportingManager ||
                    "-"}

            </td> */}
            <td style={{
        textAlign: "right",
    }}>{employee.totalProjects}</td>
            <td
    style={{
        textAlign: "left",
    }}
>
    {formatDate(employee.lowestStartDate)}
</td>

<td
    style={{
        textAlign: "left",
    }}
>
    {formatDate(employee.highestEndDate)}
</td>

<td
    style={{
        textAlign: "right",
    }}
>
    {employee.totalAllocation}%
</td>
            <td>

                <div className="actions">

                    <Link
                        className="action-btn view-btn"
                        to={`/employees/${employee._id}`}
                    >
                        View
                    </Link>

                    <Link
                        className="action-btn edit-btn"
                        to={`/employees/edit/${employee._id}`}
                    >
                        Edit
                    </Link>

                    <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(employee)}
                    >
                        Delete
                    </button>

                </div>

            </td>

        </tr>

    );

};

export default EmployeeRow;