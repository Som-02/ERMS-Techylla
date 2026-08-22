import {
    IdCard,
    User,
    Briefcase,
    FolderKanban,
    Calendar,
    CalendarCheck,
    Clock,
    SlidersHorizontal,
} from "lucide-react";
import EmployeePortalRow from "./EmployeePortalRow";
import "./employeeTable.css";

const EmployeePortalTable = ({
    employee
}) => {

    return (

        <div className="employee-table-card">
            <div className="employee-table-scroll">
                <table className="employee-table">

                <colgroup>
                    <col style={{ width: "80px" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "13%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "120px" }} />
                </colgroup>

                <thead>

                    <tr>
                        <th style={{ paddingLeft: "18px" }}>ID</th>
                        <th>
                            <div className="th-content">
                                <User size={14} />
                                <span>Name</span>
                            </div>
                        </th>
                        <th>
                            <div className="th-content">
                                <Briefcase size={14} />
                                <span>Position</span>
                            </div>
                        </th>
                        <th style={{ textAlign: "right" }}>
                            <div className="th-content" style={{ justifyContent: "flex-end" }}>
                                <FolderKanban size={14} />
                                <span>Total Projects</span>
                            </div>
                        </th>
                        <th style={{ textAlign: "left" }}>
                            <div className="th-content" style={{ justifyContent: "flex-start" }}>
                                <Calendar size={14} />
                                <span>Allocation Date</span>
                            </div>
                        </th>
                        <th style={{ textAlign: "left" }}>
                            <div className="th-content" style={{ justifyContent: "flex-start" }}>
                                <CalendarCheck size={14} />
                                <span>Release Date</span>
                            </div>
                        </th>
                        <th style={{ textAlign: "right" }}>
                            <div className="th-content" style={{ justifyContent: "flex-end" }}>
                                <Clock size={14} />
                                <span>Total Allocation</span>
                            </div>
                        </th>
                        <th style={{ textAlign: "center" }}>
                            <div className="th-content" style={{ justifyContent: "center" }}>
                                <SlidersHorizontal size={14} />
                                <span>Details</span>
                            </div>
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
        </div>
    );
};

export default EmployeePortalTable;