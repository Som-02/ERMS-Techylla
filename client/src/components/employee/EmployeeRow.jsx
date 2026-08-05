import { Link } from "react-router-dom";

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

            <td>{employee.empId}</td>

            <td>{employee.name}</td>

            <td>{employee.position}</td>

            {/* <td>{employee.email}</td> */}

            {/* <td>

                {employee.experience} Years

            </td> */}

            {/* <td>

                {employee.reportingManager?.name ||
                    employee.reportingManager ||
                    "-"}

            </td> */}
            <td>
    {employee.lowestStartDate
        ? new Date(employee.lowestStartDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "-"}
</td>

<td>
    {employee.highestEndDate
        ? new Date(employee.highestEndDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "-"}
</td>

<td>{employee.totalAllocation}%</td>
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