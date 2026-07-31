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

                        <th>Skill</th>

                        <th>Beginner</th>

                        <th>Intermediate</th>

                        <th>Expert</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        matrix.map((row) => (

                            <tr key={row.skill}>

                                <td>

                                    {row.skill}

                                </td>

                                <td>

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

                                <td>

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

                                <td>

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