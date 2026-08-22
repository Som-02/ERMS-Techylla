import { Award, SlidersHorizontal } from "lucide-react";
import SkillRow from "./SkillRow";

import "../employee/employeeTable.css";

const SkillTable = ({

    skills,

    onDelete

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

                        <th style={{ textAlign: "center" }}>
                            <div className="th-content" style={{ justifyContent: "center" }}>
                                <SlidersHorizontal size={14} />
                                <span>Actions</span>
                            </div>
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        skills.length === 0 ?

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

                            skills.map(skill => (

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
        </div>
    );
};

export default SkillTable;