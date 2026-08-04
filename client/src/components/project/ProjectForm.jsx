import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    createProject,
    updateProject,
} from "../../services/projectService";
import Select from "react-select";
import { getClients } from "../../services/clientService";
import { getSkills } from "../../services/skillService";
import { getEmployeesBySkills } from "../../services/employeeService";
import { getSkillMatrix } from "../../services/skillService";
import "./project.css";

const ProjectForm = ({
    mode = "add",
    project = null,
}) => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
    name: "",
    client: "",
    startDate: "",
    endDate: "",
    status: "Active",
    requiredSkills: [],
    assignedEmployees:[],
});

    const [clients, setClients] = useState([]);
    const [saving, setSaving] = useState(false);
    const [skills, setSkills] = useState([]);
    const [employees, setEmployees] = useState([]);
    const employeeOptions = employees.map((employee) => ({

    value: employee._id,

    label: `${employee.name} (${employee.empId})`,

}));
    const skillOptions = skills.map((skill) => ({
    value: skill._id,
    label: skill.name,
}));
    useEffect(() => {
        loadClients();
        loadSkills();
        loadEmployees([]);
    }, []);

    useEffect(() => {

        if (mode === "edit" && project) {

            setFormData({

    name: project.name || "",

    client: project.client?._id || project.client || "",

    startDate: project.startDate
        ? project.startDate.split("T")[0]
        : "",

    endDate: project.endDate
        ? project.endDate.split("T")[0]
        : "",

    status: project.status || "Active",

    requiredSkills:
        project.requiredSkills?.map(
            (skill) => skill._id
        ) || [],

    assignedEmployees:
        project.assignedEmployees?.map(
            (employee) =>
                employee._id || employee
        ) || [],

});
if (project.requiredSkills?.length > 0) {

    loadEmployees(

        project.requiredSkills.map(

            (skill) => skill._id

        )

    );

}

        }

    }, [mode, project]);

    const loadClients = async () => {

        try {

            const res = await getClients();

            setClients(res.data);

        } catch (error) {

            console.log(error);

            toast.error("Failed to load clients");

        }

    };
    const loadSkills = async () => {

    try {

        const res = await getSkills();

        setSkills(res.data);

    } catch (error) {

        console.log(error);

        toast.error("Failed to load skills");

    }

};

    const loadEmployees = async (selectedSkills) => {

    try {

        const res = await getEmployeesBySkills(
            selectedSkills
        );

        setEmployees(res.data);

    } catch (error) {

        console.log(error);

    }

};
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

    };
    const handleSkillChange = (skillId) => {

    setFormData((prev) => {

        const exists = prev.requiredSkills.includes(skillId);

        return {

            ...prev,

            requiredSkills: exists

                ? prev.requiredSkills.filter(
                      (id) => id !== skillId
                  )

                : [...prev.requiredSkills, skillId],

        };

    });

};
const filteredEmployees = employees.filter((employee) => {

    if (formData.requiredSkills.length === 0)
        return true;

    const employeeSkills = employee.skills.map(
        (skill) => skill.skill
    );

    return formData.requiredSkills.every((skillId) =>
        employeeSkills.includes(skillId)
    );

});
    const submitHandler = async (e) => {

        e.preventDefault();

        if (!formData.name.trim()) {

            toast.error("Project name is required");

            return;

        }

        if (!formData.client) {

            toast.error("Please select a client");

            return;

        }

        try {

            setSaving(true);

            if (mode === "add") {

                await createProject(formData);

                toast.success("Project added successfully");

            } else {

                await updateProject(project._id, formData);

                toast.success("Project updated successfully");

            }

            navigate("/projects");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setSaving(false);

        }

    };

    return (

        <div className="project-form-card">

            <form onSubmit={submitHandler}>

                <div className="form-group">

                    <label>Project Name</label>

                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter project name"
                    />

                </div>

                <div className="form-group">

                    <label>Client</label>

                    <select
                        className="form-control"
                        name="client"
                        value={formData.client}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Client
                        </option>

                        {clients.map(client => (

                            <option
                                key={client._id}
                                value={client._id}
                            >
                                {client.name}
                            </option>

                        ))}

                    </select>

                </div>
                
                <div className="form-group">

    <label>Start Date</label>

    <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
    />

</div>

<div className="form-group">

    <label>End Date</label>

    <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
    />

</div>
                <div className="form-group">

                    <label>Status</label>

                    <select
                        className="form-control"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >

                        <option value="Active">
                            Active
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                        <option value="On Hold">
                            On Hold
                        </option>

                    </select>

                </div>
<div className="form-group">

    <label>Role</label>

    <Select
        isMulti
        options={skillOptions}
        placeholder="Select roles..."
        value={skillOptions.filter((option) =>
            formData.requiredSkills.includes(option.value)
        )}
        onChange={async (selected) => {

    const selectedSkills = selected
        ? selected.map((item) => item.value)
        : [];

    setFormData((prev) => ({

    ...prev,

    requiredSkills: selectedSkills,

    assignedEmployees: [],

}));

    await loadEmployees(selectedSkills);

}}
    />

</div>

<div className="form-group">

    <label>Assigned Employees</label>

    <Select

        isMulti

        options={employeeOptions}

        placeholder="Select Employees..."

        value={employeeOptions.filter((employee) =>
            formData.assignedEmployees.includes(employee.value)
        )}

        onChange={(selected) =>

            setFormData((prev) => ({

                ...prev,

                assignedEmployees: selected

                    ? selected.map((item) => item.value)

                    : [],

            }))

        }

    />

</div>
                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate("/projects")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-btn"
                        disabled={saving}
                    >

                        {
                            saving
                                ? "Saving..."
                                : mode === "add"
                                    ? "Add Project"
                                    : "Update Project"
                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default ProjectForm;