import { Link } from "react-router-dom";
import "../employee/employeeTable.css";
const SkillRow = ({

    skill,

    onDelete

}) => {

    return (

        <tr>

            <td>

                {skill.name}

            </td>

            <td>

                <div className="actions">

                    <Link

                        className="action-btn edit-btn"

                        to={`/skills/edit/${skill._id}`}

                    >

                        Edit

                    </Link>

                    <button

                        className="action-btn delete-btn"

                        onClick={()=>onDelete(skill)}

                    >

                        Delete

                    </button>

                </div>

            </td>

        </tr>

    );

};

export default SkillRow;