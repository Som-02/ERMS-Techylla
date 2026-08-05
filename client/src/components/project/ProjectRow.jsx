import { Link } from "react-router-dom";
import {
    Eye,
    Pencil,
    Trash2,
    FolderKanban,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import "./project.css";

const ProjectRow = ({
    project,
    onDelete,
}) => {

    const getStatusClass = () => {

        switch (project.status) {

            case "Active":
                return "active";

            case "Completed":
                return "completed";

            case "On Hold":
                return "hold";

            default:
                return "";

        }

    };

    return (

        <tr>

            <td className="project-name">

    {project.name}

</td>

            <td>

    <span className="client-badge">

        {project.client?.name || "-"}

    </span>

</td>

<td>

    {project.startDate
        ? formatDate(project.startDate)
        : "-"}

</td>

<td>

    {project.endDate
        ? formatDate(project.endDate)
        : "-"}

</td>

<td>

    <span
        className={`status ${getStatusClass()}`}
    >

        <span className="status-dot"></span>

        {project.status}

    </span>

</td>

            <td>

                <div className="project-actions">
                <Link
    to={`/projects/${project._id}`}
    className="project-btn view-btn"
>
    <span>View</span>
</Link>
                    <Link
    to={`/projects/edit/${project._id}`}
    className="project-btn edit-btn"
>
    <span>Edit</span>
</Link>

                    <button
                        className="project-btn delete-btn"
                        title="Delete"
                        onClick={() => onDelete(project)}
                    >

                        <span>Delete</span>

                    </button>

                </div>

            </td>

        </tr>

    );

};

export default ProjectRow;