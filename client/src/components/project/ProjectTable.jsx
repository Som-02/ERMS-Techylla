import ProjectRow from "./ProjectRow";

const ProjectTable = ({
    projects,
    onDelete,
}) => {

    return (

        <table
            border="1"
            cellPadding="10"
            width="100%"
        >

            <thead>

                <tr>

                    <th>Project Name</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {(projects || []).map((project) => (

                    <ProjectRow
                        key={project._id}
                        project={project}
                        onDelete={onDelete}
                    />

                ))}

            </tbody>

        </table>

    );

};

export default ProjectTable;