import { Link } from "react-router-dom";

const ProjectRow = ({
    project,
    onDelete,
}) => {

    return (

        <tr>

            <td>{project.name}</td>

            <td>{project.client?.name || "-"}</td>

            <td>{project.status}</td>

            <td>

                <Link
                    to={`/projects/edit/${project._id}`}
                >
                    Edit
                </Link>

                {" | "}

                <button
                    onClick={() => onDelete(project)}
                >
                    Delete
                </button>

            </td>

        </tr>

    );

};

export default ProjectRow;