import { Link } from "react-router-dom";

import {
    Eye,
    Pencil
} from "lucide-react";

import { formatDate }
    from "../../utils/formatDate";

const EmployeePortalRow = ({
    employee
}) => {

    const assignmentCount =
        employee.assignments?.length || 0;

    let rowClass = "";

    if (assignmentCount > 4) {

        rowClass =
            "employee-overloaded";

    } else if (assignmentCount < 2) {

        rowClass =
            "employee-underutilized";

    }

    return (

        <tr className={rowClass}>

            <td className="emp-id-cell" style={{ textAlign: "left", paddingLeft: "18px" }}>
                <span className="emp-id">{employee.empId}</span>
            </td>

            <td className="emp-name-cell" style={{ textAlign: "left" }}>
                {employee.name}
            </td>

            <td className="emp-position-cell" style={{ textAlign: "left" }}>
                {employee.position || "-"}
            </td>

            <td style={{ textAlign: "right" }}>
                {employee.totalProjects}
            </td>

            <td style={{ textAlign: "left" }}>
                {employee.lowestStartDate
                    ? formatDate(
                        employee.lowestStartDate
                    )
                    : "-"}
            </td>

            <td style={{ textAlign: "left" }}>
                {employee.highestEndDate
                    ? formatDate(
                        employee.highestEndDate
                    )
                    : "-"}
            </td>

            <td style={{ textAlign: "right" }}>
                {employee.totalAllocation}%
            </td>

            <td>

                <div className="actions">

                    <Link
                        className="action-btn employee-view-btn"
                        to={`/employee/${employee._id}`}
                        title="View"
                    >

                        <Eye size={18} />

                    </Link>

                    <Link
                        className="action-btn employee-edit-btn"
                        to={`/employee/edit/${employee._id}`}
                        title="Edit Skills"
                    >

                        <Pencil size={18} />

                    </Link>

                </div>

            </td>

        </tr>

    );

};

export default EmployeePortalRow;