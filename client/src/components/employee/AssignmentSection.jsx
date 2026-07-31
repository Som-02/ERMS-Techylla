import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import "./employeeSection.css";
const AssignmentSection = ({
    clients = [],
    projects = [],
    assignments,
    setAssignments,
}) => {

    const [client, setClient] = useState("");
    const [project, setProject] = useState("");
    const [endDate, setEndDate] = useState("");

    const filteredProjects = useMemo(() => {
        if (!client) return [];

        return projects.filter(
            (p) =>
                p.client === client ||
                p.client?._id === client
        );
    }, [client, projects]);

    const addAssignment = () => {

        if (!client || !project || !endDate) {
            toast.error("Please select client, project and end date.");
            return;
        }

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

        const selectedClient = clients.find(
            (c) => c._id === client
        );

        const selectedProject = projects.find(
            (p) => p._id === project
        );

        setAssignments([
            ...assignments,
            {
                client,
                project,
                endDate,
                clientName: selectedClient?.name,
                projectName: selectedProject?.name,
            },
        ]);

        setClient("");
        setProject("");
        setEndDate("");

        toast.success("Assignment Added");

    };

    const removeAssignment = (index) => {

        setAssignments(
            assignments.filter((_, i) => i !== index)
        );

        toast.success("Assignment Removed");

    };

    return(

<>

<div className="assignment-grid">

    <div className="field">

        <label>Client</label>

        <select
            value={client}
            onChange={(e)=>{
                setClient(e.target.value);
                setProject("");
            }}
        >

            <option value="">Select Client</option>

            {clients.map(client=>(

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
            onChange={(e)=>setProject(e.target.value)}
        >

            <option value="">Select Project</option>

            {filteredProjects.map(project=>(

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

        <label>End Date</label>

        <input
            type="date"
            value={endDate}
            onChange={(e)=>setEndDate(e.target.value)}
        />

    </div>

    <button
        type="button"
        className="primary-btn"
        onClick={addAssignment}
    >
        + Add
    </button>

</div>

{assignments.length===0 ? (

    <div className="empty">

        No assignments added

    </div>

) : (

<table className="data-table">

<thead>

<tr>

<th>Client</th>

<th>Project</th>

<th>End Date</th>

<th></th>

</tr>

</thead>

<tbody>

{assignments.map((assignment,index)=>(

<tr key={index}>

<td>

{
assignment.clientName ||
assignment.client?.name ||
clients.find(c=>c._id===assignment.client)?.name ||
"-"
}

</td>

<td>

{
assignment.projectName ||
assignment.project?.name ||
projects.find(p=>p._id===assignment.project)?.name ||
"-"
}

</td>

<td>{assignment.endDate}</td>

<td>

<button
type="button"
className="remove-btn"
onClick={()=>removeAssignment(index)}
>

Remove

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