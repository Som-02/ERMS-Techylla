import EmployeeRow from "./EmployeeRow";
import "./employeeTable.css";

const EmployeeTable = ({
    employees,
    onDelete,
}) => {

    return (

        <div className="employee-table-card">

            <table className="employee-table">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Position</th>
                        {/* <th>WWID</th> */}
                        <th>Email</th>
                        <th>Experience</th>
                        <th>Reporting Manager</th>
                        <th>Details</th>

                    </tr>

                </thead>

                <tbody>

                    {employees.length === 0 ? (

                        <tr>

                            <td
                                colSpan="8"
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