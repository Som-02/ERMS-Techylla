import { useEffect, useState } from "react";
import "./assignmentModal.css";
import Select from "react-select";
import { formatDate } from "../../utils/formatDate";
const AssignmentModal = ({
    open,
    mode = "edit",
    assignment,
    slot,
    project,
    employees = [],
    onClose,
    onSave,
    errorMessage,
}) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [form, setForm] = useState({
        startDate: "",
        endDate: "",
        allocation: "",
    });
    
    const employeeOptions = employees.map(employee => {

    const projectRoles = project.requiredSkills.map(
        role => role.skill?.name || role.skill
    );

    const matchedSkills = employee.skills.filter(skill =>
        projectRoles.includes(skill.skill)
    );

    return {

        value: employee._id,

        empId: employee.empId,

        name: employee.name,

        location: employee.location,

        matchedSkills,

    };

});
    useEffect(() => {

    if (!open) return;

    if (mode === "edit" && assignment) {

        setSelectedEmployee(null);

        setForm({

            startDate: assignment.startDate
                ? assignment.startDate.split("T")[0]
                : "",

            endDate: assignment.endDate
                ? assignment.endDate.split("T")[0]
                : "",

            allocation: assignment.allocation || "",

        });

    }

    if (mode === "add") {

        setSelectedEmployee(null);

        setForm({

            startDate: "",

            endDate: "",

            allocation: "",

        });

    }

}, [assignment, mode, open]);

    if (!open) return null;

    return (

        <div className="assignment-modal-overlay">

            <div className="assignment-modal">

                <h2>{mode === "edit"
    ? "Edit Assignment"
    : "Assign Employee"}</h2>
    {errorMessage && (

    <div className="assignment-error">

        <strong>

            Cannot Assign Employee

        </strong>

        <p>

            {errorMessage}

        </p>

    </div>

)}

                <div className="modal-group">

                    <label>Employee</label>

                    {mode === "edit" ? (

    <input
        type="text"
        value={assignment?.name || ""}
        disabled
    />

) : (

    <Select
    classNamePrefix="react-select"
    options={employeeOptions}
    value={selectedEmployee}
    onChange={setSelectedEmployee}
    placeholder="Select Employee..."

    formatOptionLabel={(option) => (

        <div>

            <div>

                <strong>

                    {option.empId} - {option.name}

                </strong>

            </div>

            <div
                style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginTop: "2px",
                }}
            >

                {option.matchedSkills
                    .map(skill =>
                        `${skill.skill} (${skill.rating}/5)`
                    )
                    .join(", ")}

                {" • "}

                {option.location}

            </div>

        </div>

    )}
/>

)}

                </div>
{mode === "add" && (

<>

<div className="modal-group">

<label>

Role

</label>

<input

disabled

value={slot?.role || ""}

/>

</div>

<div className="modal-group">

<label>

Location

</label>

<input

disabled

value={slot?.location || ""}

/>

</div>

</>

)}
                <div className="modal-group">

                    <label>Project</label>

                    <input
                        disabled
                        value={
    mode === "edit"
        ? assignment.projectName
        : project.name || ""
}
                    />

                </div>

                <div className="modal-group">

                    <label>Client</label>

                    <input
                        disabled
                        value={
    mode === "edit"
        ? assignment.clientName
        : project?.client?.name || ""
}
                    />

                </div>

                <div className="modal-group">

                    <label>Start Date</label>

                    <input
                        type="date"
                        value={form.startDate}
                        onChange={(e)=>
                            setForm({
                                ...form,
                                startDate:e.target.value
                            })
                        }
                    />

                </div>

                <div className="modal-group">

                    <label>End Date</label>

                    <input
                        type="date"
                        value={form.endDate}
                        onChange={(e)=>
                            setForm({
                                ...form,
                                endDate:e.target.value
                            })
                        }
                    />

                </div>

                <div className="modal-group">

                    <label>Allocation (%)</label>

                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={form.allocation}
                        onChange={(e)=>
                            setForm({
                                ...form,
                                allocation:e.target.value
                            })
                        }
                    />

                </div>
{errorMessage && (

<div className="assignment-error">

{errorMessage}

</div>

)}
                <div className="modal-buttons">

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

        employeeId:
            mode === "edit"
                ? assignment.employeeId
                : selectedEmployee?.value,

        role:
            mode === "edit"
                ? assignment.role
                : slot?.role,

        location:
            mode === "edit"
                ? assignment.location
                : slot?.location,

        startDate: form.startDate,

        endDate: form.endDate,

        allocation: Number(form.allocation),

    })
}
                    >
                        {mode === "edit"
    ? "Save"
    : "Assign"}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default AssignmentModal;