import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import SkillsSection from "./SkillsSection";
import AssignmentSection from "./AssignmentSection";

import {
    createEmployee,
    updateEmployee,
} from "../../services/employeeService";
import "./employeeForm.css";
const EmployeeForm = ({
    mode = "add",
    employee = null,
    clients = [],
    projects = [],
    managers = [],
}) => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        empId: "",
        name: "",
        email: "",
        mobile: "",
        location: "", 
        // wwid: "",
        position: "",
        experience: "",
        reportingManager: "",
    });

    const [skills, setSkills] = useState([]);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {

        if (mode === "edit" && employee) {

            setFormData({
                empId: employee.empId || "",
                name: employee.name || "",
                email: employee.email || "",
                mobile: employee.mobile || "",
                location: employee.location || "",
                // wwid: employee.wwid || "",
                position: employee.position || "",
                experience: employee.experience || "",
                reportingManager:
                    employee.reportingManager?._id ||
                    employee.reportingManager ||
                    "",
            });

            setSkills(employee.skills || []);
            setAssignments(
    (employee.assignments || []).map((assignment) => ({
        client: assignment.client?._id || assignment.client,
        project: assignment.project?._id || assignment.project,
        role: assignment.role?.name || "",
location: assignment.location || "",
        startDate: assignment.startDate
            ? assignment.startDate.split("T")[0]
            : "",

        endDate: assignment.endDate
            ? assignment.endDate.split("T")[0]
            : "",

        allocation: assignment.allocation ?? "",

        clientName: assignment.client?.name,
        projectName: assignment.project?.name,
    }))
);

        }

    }, [employee, mode]);

    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };

    const submitHandler = async (e) => {

        e.preventDefault();
        if (!formData.empId.trim()) {
        toast.error("Employee ID is required");
        return;
    }

    if (!formData.name.trim()) {
        toast.error("Employee Name is required");
        return;
    }

    if (!formData.email.trim()) {
        toast.error("Email is required");
        return;
    }
    if (!formData.location) {
        toast.error("Please select a Location");
        return;
    }
    // if (!formData.mobile.trim()) {
    //     toast.error("Mobile Number is required");
    //     return;
    // }

    // if (!formData.position.trim()) {
    //     toast.error("Position is required");
    //     return;
    // }

//    if (!formData.reportingManager && managers.length > 0) {
//     toast.error("Please select a Reporting Manager");
//     return;
// }
        const data = {
    ...formData,
    reportingManager:
        formData.reportingManager === ""
            ? null
            : formData.reportingManager,
    skills,
    assignments: assignments.map((assignment) => ({
        client: assignment.client?._id || assignment.client,
        project: assignment.project?._id || assignment.project,
        role: assignment.role,
    location: assignment.location,
        startDate: assignment.startDate,
    endDate: assignment.endDate,
    allocation: assignment.allocation,
    })),
};

        try {

            if (mode === "add") {
                await createEmployee(data);

                toast.success("Employee Added Successfully");

            } else {

                await updateEmployee(employee._id, data);

                toast.success("Employee Updated Successfully");

            }

            navigate("/employees");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                    "Something went wrong"
            );

        }

    };

    return (

        <form
    className="employee-form"
    onSubmit={submitHandler}
>

            <div className="form-header">

    <h1>
        {mode === "add"
            ? "Add Employee"
            : "Edit Employee"}
    </h1>

    <p>
        Enter employee information below.
    </p>

</div>

            <br />

            <div className="form-card">

    <h3>Personal Information</h3>

    <div className="form-grid">

        <div className="form-group">

            <label>Employee ID ★</label>

            <input
                type="text"
                name="empId"
                value={formData.empId}
                onChange={handleChange}
            />

        </div>

        <div className="form-group">

            <label>Full Name ★</label>

            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
            />

        </div>

        <div className="form-group">

            <label>Email</label>

            <input placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
            />

        </div>

        <div className="form-group">

            <label>Mobile</label>

            <input placeholder="Mobile(Optional)"
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
            />

        </div>
        <div className="form-group">

    <label>Location ★</label>
    <select
        name="location"
        value={formData.location}
        onChange={handleChange}
    >
        <option value="">
            Select Location
        </option>
        <option value="Offshore / INDIA">
            Offshore / INDIA
        </option>
        <option value="Onshore / US">
            Onshore / US
        </option>
    </select>
</div>
        {/* <div className="form-group full">

            <label>WWID</label>

            <input placeholder="WWID(Optional)"
                type="text"
                name="wwid"
                value={formData.wwid}
                onChange={handleChange}
            />

        </div> */}

    </div>

</div>

            <div className="form-card">

    <h3>Professional Information</h3>

    <div className="form-grid">

        <div className="form-group">

            <label>Position</label>

            <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
            />

        </div>

        <div className="form-group">

            <label>Experience (Years)</label>

            <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
            />

        </div>

        <div className="form-group full">

            <label>Reporting Manager</label>

            <select
                name="reportingManager"
                value={formData.reportingManager}
                onChange={handleChange}
            >
                <option value="">
                    {managers.length === 0
                        ? "No Reporting Manager"
                        : "Select Reporting Manager"}
                </option>

                {managers
                    .filter(
                        manager =>
                            mode === "add" ||
                            manager._id !== employee?._id
                    )
                    .map(manager => (
                        <option
                            key={manager._id}
                            value={manager._id}
                        >
                            {manager.name}
                        </option>
                    ))}
            </select>

        </div>

    </div>

</div>

            <br />

            <div className="form-card">

    <h3>Skills</h3>

    <SkillsSection
        skills={skills}
        setSkills={setSkills}
    />

</div>

            <br />

            <div className="form-card">

    <h3>Assignments</h3>

    <AssignmentSection
        clients={clients}
        projects={projects}
        assignments={assignments}
        setAssignments={setAssignments}
        employeeLocation={formData.location}
    />

</div>

            <br />

            <div className="form-actions">

    <button
        type="button"
        className="cancel-btn"
        onClick={() => navigate("/employees")}
    >
        Cancel
    </button>

    <button
        type="submit"
        className="save-btn"
    >
        {mode === "add"
            ? "Add Employee"
            : "Update Employee"}
    </button>

</div>

        </form>

    );

};

export default EmployeeForm;