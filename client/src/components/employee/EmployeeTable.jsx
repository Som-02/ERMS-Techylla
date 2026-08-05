import EmployeeRow from "./EmployeeRow";
import "./employeeTable.css";

const EmployeeTable = ({
    employees,
    onDelete,
}) => {

    return (

        <div className="employee-table-card">

            <table className="employee-table">
<colgroup>
        <col style={{ width: "1%" }} />
        <col style={{ width: "1%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
    </colgroup>
                <thead>

                    <tr>

                        <th >ID</th>
                        <th>Name</th>
                        <th>Position</th>
                        {/* <th>WWID</th> */}
                        {/* <th>Email</th> */}
                        {/* <th>Experience</th>
                        <th>Reporting Manager</th> */}
                        <th style={{
        textAlign: "center",
    }}>Total Projects</th>
                        <th>Allocation Date (Earliest)</th>
                        <th>Release Date (Max)</th>
                        <th>Total Allocation</th>
                        <th>Details</th>

                    </tr>

                </thead>

                <tbody>

                    {employees.length === 0 ? (

                        <tr>

                            <td
                                colSpan="9"
                                className="empty-state"
                            >

                                No employees found.

                            </td>

                        </tr>

                    ) : (

                        employees.map(employee => (

                            <EmployeeRow
                                key={employee._id}
                                employee={employee}
                                onDelete={onDelete}
                            />

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

};

export default EmployeeTable;