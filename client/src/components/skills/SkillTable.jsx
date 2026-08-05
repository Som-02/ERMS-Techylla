import SkillRow from "./SkillRow";

import "../employee/employeeTable.css";

const SkillTable = ({

    skills,

    onDelete

}) => {

    return (

        <div className="employee-table-card">

            <table className="employee-table">

                <thead>

                    <tr>

                        <th>Roles</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        skills.length===0 ?

                        (

                            <tr>

                                <td
                                    colSpan="2"
                                    className="empty-state"
                                >

                                    No Skills Found

                                </td>

                            </tr>

                        )

                        :

                        skills.map(skill=>(

                            <SkillRow

                                key={skill._id}

                                skill={skill}

                                onDelete={onDelete}

                            />

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

};

export default SkillTable;