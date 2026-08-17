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
                className="employee-table" style={{
        tableLayout:"fixed",
        width:"100%",border:"none",
    }}
            >
        <colgroup>

    <col style={{ width: "23%" }} />

    <col style={{ width: "10%" }} />

    <col style={{ width: "10%" }} />

    <col style={{ width: "20%" }} />

    <col style={{ width: "21%" }} />

</colgroup>
                <thead>
<tr>

<th className="role-header">
    Role
</th>

<th className="resource-header">
    Onshore / US
</th>

<th className="resource-header">
    Offshore / IND
</th>

<th className="date-header">
    Role Created Date
</th>

<th>
    Actions
</th>

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

                                <td style={{textAlign: "left",}}>

                                    {role.resources.onshore}

                                </td>

                                <td style={{textAlign: "left",}}>

                                    {role.resources.offshore}

                                </td>
                                <td style={{textAlign:"left"}}>

{
role.roleCreatedAt

?

new Date(role.roleCreatedAt)
.toISOString()
.split("T")[0]

:

"-"

}

</td>
                                <td>

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