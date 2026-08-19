import { Link } from "react-router-dom";
import {
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import "./project.css";

const ProjectRow = ({
    index,
    project,
    onDelete,
}) => {

    const getStatusClass = () => {

        switch (project.status) {
            case "Lead":
                return "lead";

            case "Pipeline":
                return "pipeline";
                
            case "Active":
                return "active";

            case "Completed":
                return "completed";

            case "On Hold":
                return "hold";

            default:
                return "custom";

        }

    };

    return (

        <tr>
            <td>{index + 1}</td>
            <td className="project-name">

    {project.name}

</td>

            <td>
    {project.client?.logo ? (
        <img
            src={project.client.logo}
            alt={project.client.name || "Client"}
            className="project-client-logo"
        />
    ) : (
        project.client?.name || "-"
    )}
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
    className="project-btn project-view-btn"
>
    <Eye size={18} />
</Link>
                    <Link
    to={`/projects/edit/${project._id}`}
    className="project-btn project-edit-btn"
>
   <Pencil size={18} />
</Link>

                    <button
                        className="project-btn delete-btn"
                        title="Delete"
                        onClick={() => onDelete(project)}
                    >

                        <Trash2 size={18} />

                    </button>

                </div>

            </td>

        </tr>

    );

};

export default ProjectRow;