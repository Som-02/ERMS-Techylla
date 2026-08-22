import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import {
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";
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

            <td className="emp-id-cell" style={{ textAlign: "left", paddingLeft: "18px" }}>
                <span className="emp-id">{employee.empId}</span>
            </td>

            <td className="emp-name-cell" style={{ textAlign: "left" }}>{employee.name}</td>

            <td className="emp-position-cell" style={{ textAlign: "left" }}>{employee.position}</td>

            <td style={{ textAlign: "right" }}>{employee.totalProjects}</td>
            <td style={{ textAlign: "left" }}>
                {formatDate(employee.lowestStartDate)}
            </td>

            <td style={{ textAlign: "left" }}>
                {formatDate(employee.highestEndDate)}
            </td>

            <td style={{ textAlign: "right" }}>
                {employee.totalAllocation}%
            </td>
            <td>

                <div className="actions">

                    <Link
                        className="action-btn employee-view-btn"
                        to={`/employees/${employee._id}`}
                    >
                        <Eye size={18} />
                    </Link>

                    <Link
                        className="action-btn employee-edit-btn"
                        to={`/employees/edit/${employee._id}`}
                    >
                        <Pencil size={18} />
                    </Link>

                    <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(employee)}
                    >
                        <Trash2 size={18} />
                    </button>

                </div>

            </td>

        </tr>

    );

};

export default EmployeeRow;