import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import "./employeeSection.css";
import { getProject } from "../../services/projectService";
const AssignmentSection = ({
    clients = [],
    projects = [],
    assignments,
    setAssignments,
}) => {

    const [client, setClient] = useState("");
    const [project, setProject] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [allocation, setAllocation] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
const [loadingProject, setLoadingProject] = useState(false);
    const filteredProjects = useMemo(() => {

        if (!client) return [];

        return projects.filter(
            (p) =>
                p.client === client ||
                p.client?._id === client
        );

    }, [client, projects]);

    const clearForm = () => {

        setClient("");
        setProject("");
        setStartDate("");
        setEndDate("");
        setAllocation("");
        setEditingIndex(null);

    };

    const addAssignment = () => {

        if (
            !client ||
            !project ||
            !startDate ||
            !endDate
        ) {

            toast.error("Fill all fields");

            return;

        }
        if (new Date(endDate) < new Date(startDate)) {

    toast.error(
        "End Date cannot be before Start Date."
    );

    return;

}
        if (editingIndex === null) {

            const alreadyExists = assignments.some(
                (assignment) =>
                    (assignment.client === client ||
                        assignment.client?._id === client) &&
                    (assignment.project === project ||
                        assignment.project?._id === project)
            );

            if (alreadyExists) {

                toast.error("Assignment already exists.");

                return;

            }

        }

        const selectedClient = clients.find(
            (c) => c._id === client
        );

        const selectedProject = projects.find(
            (p) => p._id === project
        );

        const assignmentData = {

            client,

            project,

            startDate,

            endDate,

            allocation,

            clientName: selectedClient?.name,

            projectName: selectedProject?.name,

        };

        if (editingIndex !== null) {

            const updatedAssignments = [...assignments];

            updatedAssignments[editingIndex] =
                assignmentData;

            setAssignments(updatedAssignments);

            toast.success("Assignment Updated");

        }

        else {

            setAssignments([
                ...assignments,
                assignmentData,
            ]);

            toast.success("Assignment Added");

        }

        clearForm();

    };

    const editAssignment = (assignment, index) => {

        setClient(
            assignment.client?._id ||
            assignment.client
        );

        setProject(
            assignment.project?._id ||
            assignment.project
        );

        setStartDate(
            assignment.startDate
                ? assignment.startDate.split("T")[0]
                : ""
        );

        setEndDate(
            assignment.endDate
                ? assignment.endDate.split("T")[0]
                : ""
        );

        setAllocation(
            assignment.allocation || 100
        );

        setEditingIndex(index);

    };

    const removeAssignment = (index) => {

        setAssignments(
            assignments.filter((_, i) => i !== index)
        );

        if (editingIndex === index) {

            clearForm();

        }

        toast.success("Assignment Removed");

    };

    return (

        <>

            <div className="assignment-grid">

                <div className="field">

                    <label>Client</label>

                    <select
                        value={client}
                        onChange={(e) => {

                            setClient(e.target.value);

                            setProject("");

                        }}
                    >

                        <option value="">
                            Select Client
                        </option>

                        {clients.map((client) => (

                            <option
                                key={client._id}
                                value={client._id}
                            >
                                {client.name}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="field">

                    <label>Project</label>

                    <select
    value={project}
    onChange={async (e) => {

        const selectedProject = e.target.value;

        setProject(selectedProject);

        if (!selectedProject) return;

        // Don't overwrite dates while editing
        if (editingIndex !== null) return;

        try {

            setLoadingProject(true);

            const res = await getProject(selectedProject);

            const projectData = res.data.project;

            setStartDate(

                projectData.startDate
                    ? projectData.startDate.split("T")[0]
                    : ""

            );

            setEndDate(

                projectData.endDate
                    ? projectData.endDate.split("T")[0]
                    : ""

            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoadingProject(false);

        }

    }}
>

                        <option value="">
                            Select Project
                        </option>

                        {filteredProjects.map((project) => (

                            <option
                                key={project._id}
                                value={project._id}
                            >
                                {project.name}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="field">

                    <label>

    Start Date

    {loadingProject && (

        <span
            style={{
                color: "#2563eb",
                marginLeft: "10px",
                fontSize: "13px",
            }}
        >

            Fetching...

        </span>

    )}

</label>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) =>
                            setStartDate(e.target.value)
                        }
                    />

                </div>

                <div className="field">

                    <label>
                        End Date
                        {loadingProject && (
                            <span
                                style={{
                                    color: "#2563eb",
                                    marginLeft: "10px",
                                    fontSize: "13px",
                                }}
                            >
                                Fetching...
                            </span>
                        )}
                    </label>

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) =>
                            setEndDate(e.target.value)
                        }
                    />

                </div>

                <div className="field">

                    <label>Allocation %</label>

                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={allocation}
                        onChange={(e) =>
                            setAllocation(e.target.value)
                        }
                    />

                </div>

                <button
                    type="button"
                    className="primary-btn"
                    onClick={addAssignment}
                >

                    {editingIndex !== null
                        ? "Update"
                        : "+ Add"}

                </button>

            </div>

            {assignments.length === 0 ? (

                <div className="empty">

                    No assignments added

                </div>

            ) : (

                <table className="data-table">

                    <thead>

                        <tr>

                            <th>Client</th>

                            <th>Project</th>

                            <th>Start Date</th>

                            <th>End Date</th>

                            <th style={{textAlign: "right",}}>Allocation</th>

                            <th style={{textAlign: "center",}}>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {assignments.map((assignment, index) => (

                            <tr key={index}>

                                <td>

                                    {
                                        assignment.clientName ||
                                        assignment.client?.name ||
                                        clients.find(
                                            (c) =>
                                                c._id === assignment.client
                                        )?.name ||
                                        "-"
                                    }

                                </td>

                                <td>

                                    {
                                        assignment.projectName ||
                                        assignment.project?.name ||
                                        projects.find(
                                            (p) =>
                                                p._id === assignment.project
                                        )?.name ||
                                        "-"
                                    }

                                </td>

                                <td style={{textAlign: "left",}}>

                                    {assignment.startDate}

                                </td>

                                <td style={{textAlign: "left",}}>

                                    {assignment.endDate}

                                </td>

                                <td style={{textAlign: "right",}}>

                                    {assignment.allocation}%

                                </td>

                                <td style={{textAlign: "center",}}>

                                    <button
                                        type="button"
                                        className="primary-btn"
                                        onClick={() =>
                                            editAssignment(
                                                assignment,
                                                index
                                            )
                                        }
                                    >

                                        Edit

                                    </button>

                                    {" "}

                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() =>
                                            removeAssignment(index)
                                        }
                                    >

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </>

    );

};

export default AssignmentSection;