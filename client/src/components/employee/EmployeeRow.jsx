import { Link } from "react-router-dom";

const EmployeeRow = ({
    employee,
    onDelete,
}) => {

    return (

        <tr>

            <td>{employee.empId}</td>

            <td>{employee.name}</td>

            <td>{employee.position}</td>

            {/* <td>{employee.wwid}</td> */}

            <td>{employee.email}</td>

            <td>

                {employee.experience} Years

            </td>

            <td>

                {employee.reportingManager?.name ||
                    employee.reportingManager ||
                    "-"}

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