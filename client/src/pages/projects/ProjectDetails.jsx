import { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEmployeesBySkills } from "../../services/employeeService";
import Loader from "../../components/common/Loader";
import AssignmentModal from "../../components/project/AssignmentModal";
import { getProject, getProjectStaffingPlan, updateAssignment, deleteAssignment, assignEmployee} from "../../services/projectService";
import "./projectDetails.css";
import { formatDate } from "../../utils/formatDate";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import toast from "react-hot-toast";
const ProjectDetails = () => {

    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [staffingPlan, setStaffingPlan] = useState([]);
    const [loading, setLoading] = useState(true);
const [showAssignmentModal, setShowAssignmentModal] = useState(false);

const [assignmentMode, setAssignmentMode] = useState("edit");

const [selectedAssignment, setSelectedAssignment] = useState(null);
const [selectedSlot, setSelectedSlot] = useState(null);
const [assignmentError, setAssignmentError] = useState("");
const [availableEmployees, setAvailableEmployees] = useState([]);
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [employeeToDelete, setEmployeeToDelete] = useState(null); 
const roleListRef = useRef(null);
const [showMore, setShowMore] = useState(false);
const descriptionRef = useRef(null);
const [showHint, setShowHint] = useState(false);

const handleDescriptionScroll = () => {

    const el = descriptionRef.current;

    if (!el) return;

    const isScrollable =
        el.scrollHeight > el.clientHeight;

    if (!isScrollable) {

        setShowHint(false);

        return;

    }

    const reachedBottom =
        el.scrollTop + el.clientHeight >=
        el.scrollHeight - 2;

    setShowHint(!reachedBottom);

};
useEffect(() => {

    const checkDescription = () => {

        const el = descriptionRef.current;

        if (!el) return;

        const isScrollable =
            el.scrollHeight > el.clientHeight;

        setShowHint(isScrollable);

    };

    checkDescription();

    window.addEventListener(
        "resize",
        checkDescription
    );

    return () =>
        window.removeEventListener(
            "resize",
            checkDescription
        );

}, [project]);
useEffect(() => {
    const list = roleListRef.current;

    if (!list) return;

    const checkScroll = () => {
        const atBottom =
            list.scrollTop + list.clientHeight >= list.scrollHeight - 2;

        setShowMore(!atBottom);
    };

    checkScroll();

    list.addEventListener("scroll", checkScroll);

    return () => list.removeEventListener("scroll", checkScroll);

}, [project]);
useEffect(() => {

        loadProject();

    }, []);

    const loadProject = async () => {

        try {

            const res = await getProjectStaffingPlan(id);

setProject(res.data.project);

setStaffingPlan(res.data.staffingPlan);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <div className="project-details">

            <Link
                className="back-link"
                to="/projects"
            >
                ← Back to Projects
            </Link>

            <h1>

                {project.name}

            </h1>

            <div className="project-card">

    {/* <div className="detail">

        <span>Client</span>

        <strong>

            {project.client?.name}

        </strong>

    </div>

    <div className="detail">

        <span>Status</span>

        <strong>

            {project.status}

        </strong>

    </div> */}
    <div className="detail">

    <span>

        Reference

    </span>

    <strong>

        {project.reference || "-"}

    </strong>

</div>
<div className="detail description-card">

    <span>Brief Description</span>

    <div

        ref={descriptionRef}

        onScroll={handleDescriptionScroll}

        className="description-content"

    >
        
        {project.description || "-"}

    </div>

    {showHint && (

        <div className="scroll-hin">

            Scroll for more...

        </div>

    )}

</div>
<div className="detail">

    <span>

        Project Category

    </span>

    <strong>

        {project.type || "-"}

    </strong>

</div>
    <div className="detail">

    <span>Duration</span>

    <strong>

        {project.startDate
            ? formatDate(project.startDate)
            : "-"}

        {"  --  "}

        {project.endDate
            ? formatDate(project.endDate)
            : "-"}

    </strong>

</div>

    <div className="detail">

        <span>Employees Assigned</span>

        <strong>

            {staffingPlan.filter(slot => slot.employee).length}

        </strong>

    </div>
    
</div>

            <div className="table-header">

    <h2>Project Resource Plan</h2>


</div>

            {

                staffingPlan.length === 0 ?

                (

                    <div className="empty">

                        No resource requirements defined for this project.

                    </div>

                ) :

                (

                    <table className="employee-table">
<colgroup>
        <col style={{ width: "25%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
    </colgroup>
                        <thead>

<tr>

<th>Role</th>

<th>Location</th>

<th>ID</th>

<th>Name</th>

<th>Start Date</th>

<th>End Date</th>

<th style={{
        textAlign: "right",
    }}>Allocation</th>

<th style={{
        textAlign: "center",
    }}>Actions</th>

</tr>

</thead>

                        <tbody>

                            {

                                staffingPlan.map((slot, index) => (

                                    <tr key={index}>

<td style={{
        textAlign: "left",
    }}>

{slot.role}

</td>

<td style={{
        textAlign: "left",
    }}>

{slot.location}

</td>

<td style={{
        textAlign: "left",
    }}>

{slot.employee?.empId || "-"}

</td>

<td style={{
        textAlign: "left",
    }}>

{slot.employee?.name || "-"}

</td>

<td style={{
        textAlign: "left",
    }}>

{slot.employee?.startDate
? formatDate(slot.employee.startDate)
: "-"}

</td>

<td style={{
        textAlign: "left",
    }}>

{slot.employee?.endDate
? formatDate(slot.employee.endDate)
: "-"}

</td>

<td style={{
        textAlign: "right",
    }}>
    {slot.employee
        ? (
            slot.employee.allocation === null ||
            slot.employee.allocation === undefined ||
            slot.employee.allocation === ""
        )
            ? "-"
            : `${slot.employee.allocation}%`
        : "-"}
</td>

<td style={{
        textAlign: "center",
    }}>

{slot.employee ? (

<div className="table-actions">

<button

className="action-btn edit-btn"

onClick={() => {

setSelectedAssignment({

employeeId: slot.employee._id,

name: slot.employee.name,
role: slot.role,

location: slot.location,
projectName: project.name,

clientName: project.client?.name,

startDate: slot.employee.startDate,

endDate: slot.employee.endDate,

allocation: slot.employee.allocation,

});

setAssignmentMode("edit");

setShowAssignmentModal(true);

}}

>

Edit

</button>

<button

className="action-btn delete-btn"

onClick={() => {
setEmployeeToDelete({

    ...slot.employee,

    role: slot.role,

});

setShowDeleteDialog(true);

}}

>

Delete

</button>

</div>

) : (

<button

className="assign-btn"

onClick={async () => {

try{

// Remember which slot we clicked

setSelectedSlot(slot);

// Find the matching skill in the project

const skill = project.requiredSkills.find(

item =>

item.skill.name === slot.role

);

if(!skill){

toast.error("Role not found.");

return;

}

// Load employees having that role

const res = await getEmployeesBySkills([

skill.skill._id

]);

// Filter by location

const filtered = res.data.filter(

employee =>

employee.location === slot.location

);

// Remove already assigned employees

const available = filtered.filter(employee =>

    !staffingPlan.some(

        s =>

            s.employee?._id === employee._id &&

            s.role === slot.role

    )

);

setAvailableEmployees(available);

setAssignmentMode("add");

setSelectedAssignment(null);

setAssignmentError("");

setShowAssignmentModal(true);

}

catch(error){

console.log(error);

}

}}

>

Assign

</button>

)}

</td>

</tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

<AssignmentModal

    open={showAssignmentModal}

    mode={assignmentMode}

    assignment={selectedAssignment}
    slot={selectedSlot}
    project={project}

    employees={availableEmployees}

    errorMessage={assignmentError}

    onClose={() => {

        setAssignmentError("");

        setShowAssignmentModal(false);

    }}

    onSave={async (data) => {

        try {

    setAssignmentError("");

    if (assignmentMode === "edit") {
console.log(data);
        await updateAssignment(
            project._id,
            selectedAssignment.employeeId,
            data
        );

    }

    else {

        await assignEmployee(
            project._id,
            data
        );

    }

    setShowAssignmentModal(false);

    loadProject();

}

catch (error) {

    setAssignmentError(

        error.response?.data?.message ||

        "Unable to assign employee."

    );

}

    }}

/>
<ConfirmDialog
    open={showDeleteDialog}
    title="Remove Employee"
    message={`Remove ${employeeToDelete?.name} from this project?`}
    confirmText="Remove"
    cancelText="Cancel"
    onCancel={() => {

        setShowDeleteDialog(false);

        setEmployeeToDelete(null);

    }}
    onConfirm={async () => {

        try {

            await deleteAssignment(

                project._id,

                employeeToDelete._id,
                employeeToDelete.role

            );

            setShowDeleteDialog(false);

            setEmployeeToDelete(null);

            loadProject();

        }

        catch (error) {

            console.log(error);

        }

    }}
/>
        </div>

    );

};

export default ProjectDetails;