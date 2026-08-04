import ProjectRow from "./ProjectRow";
import "./project.css";

const ProjectTable = ({
    projects,
    onDelete,
}) => {

    return (

        <div className="project-table-wrapper">

            <table className="project-table">

                <thead>

                    <tr>

    <th>Project</th>

    <th>Client</th>

    <th>Start Date</th>

    <th>End Date</th>

    <th>Status</th>

    <th
        style={{
            width: "170px",
        }}
    >
        Actions
    </th>

</tr>

                </thead>

                <tbody>

                    {

                        projects.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="empty-table"
                                >

                                    No Projects Found

                                </td>

                            </tr>

                        ) : (

                            projects.map(project => (

                                <ProjectRow
                                    key={project._id}
                                    project={project}
                                    onDelete={onDelete}
                                />

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

};

export default ProjectTable;