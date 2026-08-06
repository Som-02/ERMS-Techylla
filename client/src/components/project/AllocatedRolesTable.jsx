const AllocatedRolesTable = ({
    roles,
    onEdit,
    onDelete,
}) => {

    if (roles.length === 0) {

        return null;

    }

    return (

        <div
            style={{
                marginTop:25,
            }}
        >

            <h3>

                Resources Allocated to Roles

            </h3>

            <table
                className="employee-table"
            >

                <thead>

                    <tr>

                        <th>Role</th>

                        <th style={{textAlign: "center",}}>Onshore/US</th>

                        <th style={{textAlign: "center",}}>Offshore/IND</th>

                        <th style={{textAlign: "center",}}>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        roles.map(role => (

                            <tr
                                key={role.skill}
                            >

                                <td style={{textAlign: "left",}}>

                                    {role.skillName}

                                </td>

                                <td style={{textAlign: "center",}}>

                                    {role.resources.onshore}

                                </td>

                                <td style={{textAlign: "center",}}>

                                    {role.resources.offshore}

                                </td>

                                <td style={{textAlign: "center",}}>

                                    <div
                                        className="project-actions"
                                    >

                                        <button
                                            type="button"
                                            className="project-btn edit-btn"
                                            onClick={() =>
                                                onEdit(role)
                                            }
                                        >

                                            Edit

                                        </button>

                                        <button
                                            type="button"
                                            className="project-btn delete-btn"
                                            onClick={() =>
                                                onDelete(role.skill)
                                            }
                                        >

                                            Delete

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

};

export default AllocatedRolesTable;