import { Award, TrendingUp, BarChart2, Star } from "lucide-react";
import "../employee/employeeTable.css";

const SkillMatrixTable = ({

    matrix,

    openModal

}) => {

    return (

        <div className="employee-table-card">
            <div className="employee-table-scroll">
                <table className="employee-table">

                <thead>

                    <tr>

                        <th style={{ textAlign: "left" }}>
                            <div className="th-content">
                                <Award size={14} />
                                <span>Roles</span>
                            </div>
                        </th>

                        <th style={{ textAlign: "left" }}>
                            <div className="th-content">
                                <TrendingUp size={14} />
                                <span>Beginner</span>
                            </div>
                        </th>

                        <th style={{ textAlign: "left" }}>
                            <div className="th-content">
                                <BarChart2 size={14} />
                                <span>Intermediate</span>
                            </div>
                        </th>

                        <th style={{ textAlign: "left" }}>
                            <div className="th-content">
                                <Star size={14} />
                                <span>Expert</span>
                            </div>
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        matrix.map((row) => (

                            <tr key={row.skill}>

                                <td style={{ textAlign: "left" }}>

                                    {row.skill}

                                </td>

                                <td style={{ textAlign: "left" }}>

                                    <button

                                        className="action-btn view-btn"

                                        onClick={() =>

                                            openModal({

                                                open: true,

                                                title: `${row.skill} - Beginner`,

                                                employees: row.junior

                                            })

                                        }

                                    >

                                        {row.junior.length}

                                    </button>

                                </td>

                                <td style={{ textAlign: "left" }}>

                                    <button

                                        className="action-btn view-btn"

                                        onClick={() =>

                                            openModal({

                                                open: true,

                                                title: `${row.skill} - Intermediate`,

                                                employees: row.intermediate

                                            })

                                        }

                                    >

                                        {row.intermediate.length}

                                    </button>

                                </td>

                                <td style={{ textAlign: "left" }}>

                                    <button

                                        className="action-btn view-btn"

                                        onClick={() =>

                                            openModal({

                                                open: true,

                                                title: `${row.skill} - Expert`,

                                                employees: row.senior

                                            })

                                        }

                                    >

                                        {row.senior.length}

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>
            </div>
        </div>
    );
};

export default SkillMatrixTable;