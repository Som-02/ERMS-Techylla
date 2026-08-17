import { useState, useEffect } from "react";

const RoleResourceModal = ({
    open,
    role,
    onClose,
    onSave,
    existingData,
}) => {

    const [onshore, setOnshore] = useState("");

    const [offshore, setOffshore] = useState("");
    const [roleCreatedAt,setRoleCreatedAt]=useState("");
    useEffect(() => {

        if (!open) return;

        setOnshore(
            existingData?.resources?.onshore ?? ""
        );

        setOffshore(
            existingData?.resources?.offshore ?? ""
        );
        setRoleCreatedAt(
    existingData?.roleCreatedAt
    ?
    existingData.roleCreatedAt.split("T")[0]
    :
    new Date().toISOString().split("T")[0]
);
    }, [open, existingData]);

    if (!open) return null;

    return (

        <div className="preview-overlay">

            <div
                className="preview-modal"
                style={{ maxWidth: 450 }}
            >

                <h2>

                    {role?.label}

                </h2>

                <h4>

                    No. of Resources

                </h4>

                <table
                    style={{
                        width: "100%",
                        marginTop: 20,
                    }}
                >

                    <thead>

                        <tr>

                            <th>Onshore / US</th>

                            <th>Offshore / INDIA</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>

                                <input
                                    className="form-control"
                                    type="number"
                                    min="0"
                                    value={onshore}
                                    onChange={(e) =>
                                        setOnshore(
                                            e.target.value
                                        )
                                    }
                                />

                            </td>

                            <td>

                                <input
                                    className="form-control"
                                    type="number"
                                    min="0"
                                    value={offshore}
                                    onChange={(e) =>
                                        setOffshore(
                                            e.target.value
                                        )
                                    }
                                />

                            </td>

                        </tr>

                    </tbody>

                </table>
                <div
 style={{
    marginTop:20
 }}
>

<label>
    Role Created Date
</label>


<input

className="form-control"

type="date"

value={roleCreatedAt}

onChange={(e)=>
    setRoleCreatedAt(e.target.value)
}

/>

</div>                    
                <div
                    className="preview-actions"
                    style={{
                        marginTop: 25,
                    }}
                >
                
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >

                        Cancel

                    </button>

                    <button
                        className="save-btn"
                        onClick={() =>
                            onSave({

                                skill: role.value,

                                skillName:
                                    role.label,
                                roleCreatedAt: roleCreatedAt,
                                resources: {

                                    onshore:
                                        Number(
                                            onshore
                                        ) || 0,

                                    offshore:
                                        Number(
                                            offshore
                                        ) || 0,

                                },

                            })
                        }
                    >

                        Save

                    </button>

                </div>

            </div>

        </div>

    );

};

export default RoleResourceModal;