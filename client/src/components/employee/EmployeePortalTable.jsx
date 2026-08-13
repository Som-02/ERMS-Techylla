import EmployeePortalRow
    from "./EmployeePortalRow";

import "./employeeTable.css";

const EmployeePortalTable = ({
    employee
}) => {

    return (

        <div className="employee-table-card">

            <table className="employee-table">

                <colgroup>

                    <col style={{ width: "5%" }} />

                    <col style={{ width: "12%" }} />

                    <col style={{ width: "12%" }} />

                    <col style={{ width: "10%" }} />

                    <col style={{ width: "12%" }} />

                    <col style={{ width: "12%" }} />

                    <col style={{ width: "10%" }} />

                    <col style={{ width: "10%" }} />

                </colgroup>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Position</th>

                        <th
                            style={{
                                textAlign: "right"
                            }}
                        >
                            Total Projects
                        </th>

                        <th>
                            Allocation Date
                        </th>

                        <th>
                            Release Date
                        </th>

                        <th
                            style={{
                                textAlign: "right"
                            }}
                        >
                            Total Allocation
                        </th>

                        <th
                            style={{
                                textAlign: "center"
                            }}
                        >
                            Details
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {!employee ? (

                        <tr>

                            <td
                                colSpan="8"
                                className="empty-state"
                            >
                                Employee not found.
                            </td>

                        </tr>

                    ) : (

                        <EmployeePortalRow
                            employee={employee}
                        />

                    )}

                </tbody>

            </table>

        </div>

    );

};

export default EmployeePortalTable;