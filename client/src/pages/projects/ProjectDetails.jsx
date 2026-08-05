import { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEmployeesBySkills } from "../../services/employeeService";
import Loader from "../../components/common/Loader";
import AssignmentModal from "../../components/project/AssignmentModal";
import { getProject, updateAssignment, deleteAssignment, assignEmployee} from "../../services/projectService";
import "./projectDetails.css";
import { formatDate } from "../../utils/formatDate";
import ConfirmDialog from "../../components/common/ConfirmDialog";
const ProjectDetails = () => {

    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
const [showAssignmentModal, setShowAssignmentModal] = useState(false);

const [assignmentMode, setAssignmentMode] = useState("edit");

const [selectedAssignment, setSelectedAssignment] = useState(null);

const [availableEmployees, setAvailableEmployees] = useState([]);
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [employeeToDelete, setEmployeeToDelete] = useState(null); 
const roleListRef = useRef(null);
const [showMore, setShowMore] = useState(false);

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

            const res = await getProject(id);

            setProject(res.data.project);

            setEmployees(res.data.employees);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }
const openAssignModal = async () => {

    try {

        const skillIds = project.requiredSkills.map(

            skill => skill._id

        );

        const res = await getEmployeesBySkills(skillIds);

        const filteredEmployees = res.data.filter(employee =>

            !employees.some(

                assigned =>

                    assigned._id === employee._id

            )

        );

        setAvailableEmployees(filteredEmployees);

        setAssignmentMode("add");

        setSelectedAssignment(null);

        setShowAssignmentModal(true);

    }

    catch (error) {

        console.log(error);

    }

};
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

        <span>Project Start Date</span>

        <strong>

            {project.startDate
                ? formatDate(project.startDate)
                : "-"}

        </strong>

    </div>

    <div className="detail">

        <span>Project End Date</span>

        <strong>

            {project.endDate
                ? formatDate(project.endDate)
                : "-"}

        </strong>

    </div>

    <div className="detail">

        <span>Employees Assigned</span>

        <strong>

            {employees.length}

        </strong>

    </div>
    <div className="detail">

    <span>Roles</span>

    <div className="role-list-wrapper">

    <div
        className="role-list"
        ref={roleListRef}
    >

        <ul>

            {project.requiredSkills.map(skill => (

                <li key={skill._id || skill.name}>

                    {skill.name}

                </li>

            ))}

        </ul>

    </div>

    {showMore && (

        <div className="scroll-hint">

            ↓

        </div>

    )}

</div>

</div>

</div>

            <div className="table-header">

    <h2>Assigned Employees</h2>

   <button
    className="assign-btn"
    onClick={openAssignModal}
>
    + Assign Employee
</button>

</div>

            {

                employees.length === 0 ?

                (

                    <div className="empty">

                        No employees assigned.

                    </div>

                ) :

                (

                    <table className="employee-table">

                        <thead>

                            <tr>

    <th>Employee ID</th>

    <th>Name</th>

    <th>Position</th>

    <th>Experience</th>

    <th>Start Date</th>

    <th>End Date</th>

    <th>Allocation</th>
    <th>Actions</th>
</tr>

                        </thead>

                        <tbody>

                            {

                                employees.map(employee => (

                                    <tr key={employee._id}>

                                        <td style={{
        textAlign: "left",
    }}>

                                            {employee.empId}

                                        </td>

                                        <td style={{
        textAlign: "left",
    }}>

                                            {employee.name}

                                        </td>

                                        <td style={{
        textAlign: "left",
    }}>

                                            {employee.position}

                                        </td>

                                        <td style={{
        textAlign: "left",
    }}>

                                            {employee.experience} Years

                                        </td>

                                        <td style={{
        textAlign: "left",
    }}>

    {employee.startDate
        ? formatDate(employee.startDate)
        : "-"}

</td>

<td style={{
        textAlign: "left",
    }}>

    {employee.endDate
        ? formatDate(employee.endDate)
        : "-"}

</td>

<td style={{
        textAlign: "left",
    }}>

    {employee.allocation}%

</td>
<td>
<div className="table-actions">
<button
className="action-btn edit-btn"
onClick={()=>{

setSelectedAssignment({

employeeId:employee._id,

name:employee.name,

projectName:project.name,

clientName:project.client?.name,

startDate:employee.startDate,

endDate:employee.endDate,

allocation:employee.allocation,

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

        setEmployeeToDelete(employee);

        setShowDeleteDialog(true);

    }}
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

                )

            }

<AssignmentModal

    open={showAssignmentModal}

    mode={assignmentMode}

    assignment={selectedAssignment}

    project={project}

    employees={availableEmployees}

    onClose={() => setShowAssignmentModal(false)}

    onSave={async (data) => {

        try {

            if (assignmentMode === "edit") {

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

            console.log(error);

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

                employeeToDelete._id

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