import "../employee/employeeTable.css";
const SkillMatrixTable = ({

    matrix,

    openModal

}) => {

    return (

        <div className="employee-table-card">

            <table className="employee-table">

                <thead>

                    <tr>

                        <th>Roles</th>

                        <th style={{
        textAlign: "right",
    }}>Beginner</th>

                        <th style={{
        textAlign: "right",
    }}>Intermediate</th>

                        <th style={{
        textAlign: "right",
    }}>Expert</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        matrix.map((row) => (

                            <tr key={row.skill}>

                                <td style={{
        textAlign: "left",
    }}>

                                    {row.skill}

                                </td>

                                <td style={{
        textAlign: "right",
    }}>

                                    <button

                                        className="action-btn view-btn"

                                        onClick={() =>

                                            openModal({

                                                open: true,

                                                title: `${row.skill} - Junior`,

                                                employees: row.junior

                                            })

                                        }

                                    >

                                        {row.junior.length}

                                    </button>

                                </td>

                                <td style={{
        textAlign: "right",
    }}>

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

                                <td style={{
        textAlign: "right",
    }}>

                                    <button

                                        className="action-btn view-btn"

                                        onClick={() =>

                                            openModal({

                                                open: true,

                                                title: `${row.skill} - Senior`,

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

    );

};

export default SkillMatrixTable;