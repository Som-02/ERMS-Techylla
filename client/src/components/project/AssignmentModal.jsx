import { useEffect, useState } from "react";
import "./assignmentModal.css";
import Select from "react-select";
const AssignmentModal = ({
    open,
    mode = "edit",
    assignment,
    project,
    employees = [],
    onClose,
    onSave,
}) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [form, setForm] = useState({
        startDate: "",
        endDate: "",
        allocation: 100,
    });
    const employeeOptions = employees.map(employee => ({

    value: employee._id,

    label: `${employee.empId} - ${employee.name}`,

}));
    useEffect(() => {

    if (mode === "edit" && assignment) {

        setForm({

            startDate: assignment.startDate
                ? assignment.startDate.split("T")[0]
                : "",

            endDate: assignment.endDate
                ? assignment.endDate.split("T")[0]
                : "",

            allocation: assignment.allocation || 100,

        });

    }

    if (mode === "add") {

        setSelectedEmployee(null);

        setForm({

            startDate: "",

            endDate: "",

            allocation: 100,

        });

    }

}, [assignment, mode]);

    if (!open) return null;

    return (

        <div className="assignment-modal-overlay">

            <div className="assignment-modal">

                <h2>{mode === "edit"
    ? "Edit Assignment"
    : "Assign Employee"}</h2>

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
        options={employeeOptions}
        value={selectedEmployee}
        onChange={setSelectedEmployee}
        placeholder="Select Employee..."
    />

)}

                </div>

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

        employeeId: selectedEmployee?.value,

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