import { Link } from "react-router-dom";
import "../employee/employeeTable.css";
import {
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";
const SkillRow = ({

    skill,

    onDelete

}) => {

    return (

        <tr>

            <td style={{
        textAlign: "left",
    }}>

                {skill.name}

            </td>

            <td>

                <div className="actions">

                    <Link

                        className="action-btn skill-edit-btn"

                        to={`/skills/edit/${skill._id}`}

                    >

                        <Pencil size={18} />

                    </Link>

                    <button

                        className="action-btn delete-btn"

                        onClick={()=>onDelete(skill)}

                    >

                        <Trash2 size={18} />

                    </button>

                </div>

            </td>

        </tr>

    );

};

export default SkillRow;