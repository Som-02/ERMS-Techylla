import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    createProject,
    updateProject,
    getProjectCategories,
    createProjectCategory,
    updateProjectCategory,
    deleteProjectCategory,
    getProjectStatuses,
    createProjectStatus,
    updateProjectStatus,
    deleteProjectStatus,
} from "../../services/projectService";
import Select, { components } from "react-select";
import { getClients } from "../../services/clientService";
import { getSkills } from "../../services/skillService";
import { getEmployeesBySkills } from "../../services/employeeService";
import { getSkillMatrix } from "../../services/skillService";
import "./project.css";
import RoleResourceModal from "../../components/project/RoleResourceModal";
import AllocatedRolesTable from "../../components/project/AllocatedRolesTable";
const ClientOption = (props) => (
    <components.Option {...props}>
        <div className="client-select-option">

            {props.data.logo && (
                <img
                    src={props.data.logo}
                    alt=""
                    className="client-select-logo"
                />
            )}

            <span>
                {props.data.label}
            </span>

        </div>
    </components.Option>
);

const ClientSingleValue = (props) => (
    <components.SingleValue {...props}>
        <div className="client-select-option">

            {props.data.logo && (
                <img
                    src={props.data.logo}
                    alt=""
                    className="client-select-logo"
                />
            )}

            <span>
                {props.data.label}
            </span>

        </div>
    </components.SingleValue>
);
const ProjectForm = ({
    mode = "add",
    project = null,
}) => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
    name: "",
    client: "",
    reference: "",
    description: "",
    type: "",
    startDate: "",
    endDate: "",
    status: "Lead",
    requiredSkills: [],
    assignedEmployees:[],
});

    const [clients, setClients] = useState([]);
    const [saving, setSaving] = useState(false);
    const [skills, setSkills] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [projectCategories, setProjectCategories] =
    useState([]);

const [addingCategory, setAddingCategory] =
    useState(false);

const [newCategory, setNewCategory] =
    useState("");

const [savingCategory, setSavingCategory] =
    useState(false);
const [categoryDropdownOpen, setCategoryDropdownOpen] =
    useState(false);

const [editingCategoryId, setEditingCategoryId] =
    useState(null);

const [editingCategoryName, setEditingCategoryName] =
    useState("");

const [categoryDeleteModal, setCategoryDeleteModal] =
    useState(null);

const [savingEditedCategory, setSavingEditedCategory] =
    useState(false);

const [projectStatuses, setProjectStatuses] =
    useState([]);

const [addingStatus, setAddingStatus] =
    useState(false);

const [newStatus, setNewStatus] =
    useState("");

const [savingStatus, setSavingStatus] =
    useState(false);

const [statusDropdownOpen, setStatusDropdownOpen] =
    useState(false);

const [editingStatusId, setEditingStatusId] =
    useState(null);

const [editingStatusName, setEditingStatusName] =
    useState("");

const [statusDeleteModal, setStatusDeleteModal] =
    useState(null);

const [savingEditedStatus, setSavingEditedStatus] =
    useState(false);
const [roleModalOpen, setRoleModalOpen] = useState(false);
const [selectedRole, setSelectedRole] = useState(null);
const [editingRoleIndex, setEditingRoleIndex] = useState(null);
const clientOptions = clients.map((client) => ({
    value: client._id,
    label: client.name,
    logo: client.logo || "",
}));    
const employeeOptions = employees.map((employee) => ({

    value: employee._id,

    label: `${employee.name} (${employee.empId})`,

}));
    const skillOptions = skills.map((skill) => ({
    value: skill._id,
    label: skill.name,
}));
const availableSkillOptions = skillOptions.filter(
    (option) =>
        !formData.requiredSkills.some(
            (item) => item.skill === option.value
        )
);
    useEffect(() => {
        loadClients();
        loadSkills();
        loadProjectCategories();
        loadProjectStatuses();
        loadEmployees([]);
    }, []);

    useEffect(() => {

    if (mode === "edit" && project) {

        const requiredSkills =
            project.requiredSkills?.map((item) => ({
                skill: item.skill._id,
                skillName: item.skill.name,
                resources: {
                    onshore: item.resources?.onshore || 0,
                    offshore: item.resources?.offshore || 0,
                },
                roleCreatedAt:
                    item.roleCreatedAt || ""
            })) || [];


        setFormData({

            name: project.name || "",

            client:
                project.client?._id ||
                project.client ||
                "",

            reference:
                project.reference || "",

            description:
                project.description || "",

            type:
                project.type || "",

            startDate:
                project.startDate
                    ? project.startDate.split("T")[0]
                    : "",

            endDate:
                project.endDate
                    ? project.endDate.split("T")[0]
                    : "",

            status:
                project.status || "Lead",

            requiredSkills,

            assignedEmployees:
                project.assignedEmployees?.map(
                    (employee) =>
                        employee._id || employee
                ) || [],

        });


        // Load employees using the freshly
        // calculated requiredSkills instead of
        // the old React state.

        if (requiredSkills.length > 0) {

            loadEmployees(
                requiredSkills.map(
                    role => role.skill
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
const loadProjectCategories = async () => {

    try {

        const res =
            await getProjectCategories();

        setProjectCategories(
            res.data || []
        );

    } catch (error) {

        console.log(error);

        toast.error(
            "Failed to load project categories"
        );

    }

};
const loadProjectStatuses = async () => {

    try {

        const res =
            await getProjectStatuses();

        setProjectStatuses(
            res.data || []
        );

    } catch (error) {

        console.log(error);

        toast.error(
            "Failed to load project statuses"
        );

    }

};
const handleAddCategory = async () => {

    const category =
        newCategory.trim();

    if (!category) {

        toast.error(
            "Please enter a project category"
        );

        return;

    }

    try {

        setSavingCategory(true);

        const res =
            await createProjectCategory(
                category
            );

        /*
         * Backend returns:
         *
         * {
         *   _id: "...",
         *   name: "New Category",
         *   isActive: true
         * }
         *
         * Keep the complete object in state.
         */

        const createdCategory =
            res.data;

        setProjectCategories(prev => {

            const exists =
                prev.some(
                    item =>
                        item.name.toLowerCase() ===
                        createdCategory.name.toLowerCase()
                );

            if (exists) {

                return prev;

            }

            return [
                ...prev,
                createdCategory,
            ].sort((a, b) =>
                a.name.localeCompare(b.name)
            );

        });

        // Automatically select the new category
        setFormData(prev => ({

            ...prev,

            type: createdCategory.name,

        }));

        setNewCategory("");

        setAddingCategory(false);

        setCategoryDropdownOpen(false);

        toast.success(
            "Project category added successfully"
        );

    } catch (error) {

        toast.error(

            error.response?.data?.message ||
            "Failed to add project category"

        );

    } finally {

        setSavingCategory(false);

    }

};
const handleEditCategory = async () => {

    const name =
        editingCategoryName.trim();

    if (!name) {

        toast.error(
            "Category name cannot be empty"
        );

        return;

    }

    try {

        setSavingEditedCategory(true);

        const res =
            await updateProjectCategory(
                editingCategoryId,
                name
            );

        const updatedCategory =
            res.data;

        setProjectCategories(prev =>
            prev
                .map(category => {

                    if (
                        category._id ===
                        editingCategoryId
                    ) {

                        return updatedCategory;

                    }

                    return category;

                })
                .sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
        );

        // If the edited category was selected,
        // keep the new name selected.
        if (
            formData.type ===
            projectCategories.find(
                category =>
                    category._id ===
                    editingCategoryId
            )?.name
        ) {

            setFormData(prev => ({

                ...prev,

                type: updatedCategory.name,

            }));

        }

        setEditingCategoryId(null);

        setEditingCategoryName("");

        toast.success(
            "Project category updated successfully"
        );

    } catch (error) {

        toast.error(

            error.response?.data?.message ||
            "Failed to update project category"

        );

    } finally {

        setSavingEditedCategory(false);

    }

};
const handleDeleteCategory = async () => {

    if (!categoryDeleteModal) {
        return;
    }

    try {

        await deleteProjectCategory(
            categoryDeleteModal._id
        );

        setProjectCategories(prev =>
            prev.filter(
                category =>
                    category._id !==
                    categoryDeleteModal._id
            )
        );

        // If deleted category was selected,
        // clear the selection.
        if (
            formData.type ===
            categoryDeleteModal.name
        ) {

            setFormData(prev => ({

                ...prev,

                type: "",

            }));

        }

        setCategoryDeleteModal(null);

        toast.success(
            "Project category removed successfully"
        );

    } catch (error) {

        toast.error(

            error.response?.data?.message ||
            "Failed to remove project category"

        );

    }

};
const handleAddStatus = async () => {

    const status =
        newStatus.trim();

    if (!status) {

        toast.error(
            "Please enter a project status"
        );

        return;

    }

    try {

        setSavingStatus(true);

        const res =
            await createProjectStatus(
                status
            );

        const createdStatus =
            res.data;

        setProjectStatuses(prev => {

            const exists =
                prev.some(
                    item =>
                        item.name.toLowerCase() ===
                        createdStatus.name.toLowerCase()
                );

            if (exists) {
                return prev;
            }

            return [
                ...prev,
                createdStatus,
            ].sort((a, b) =>
                a.name.localeCompare(b.name)
            );

        });

        setFormData(prev => ({

            ...prev,

            status: createdStatus.name,

        }));

        setNewStatus("");

        setAddingStatus(false);

        setStatusDropdownOpen(false);

        toast.success(
            "Project status added successfully"
        );

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Failed to add project status"
        );

    } finally {

        setSavingStatus(false);

    }

};
const handleEditStatus = async () => {

    const name =
        editingStatusName.trim();

    if (!name) {

        toast.error(
            "Status name cannot be empty"
        );

        return;

    }

    try {

        setSavingEditedStatus(true);

        const res =
            await updateProjectStatus(
                editingStatusId,
                name
            );

        const updatedStatus =
            res.data;

        setProjectStatuses(prev =>
            prev
                .map(status => {

                    if (
                        status._id ===
                        editingStatusId
                    ) {

                        return updatedStatus;

                    }

                    return status;

                })
                .sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
        );

        const oldStatus =
            projectStatuses.find(
                status =>
                    status._id ===
                    editingStatusId
            );

        if (
            formData.status ===
            oldStatus?.name
        ) {

            setFormData(prev => ({

                ...prev,

                status: updatedStatus.name,

            }));

        }

        setEditingStatusId(null);

        setEditingStatusName("");

        toast.success(
            "Project status updated successfully"
        );

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Failed to update project status"
        );

    } finally {

        setSavingEditedStatus(false);

    }

};
const handleDeleteStatus = async () => {

    if (!statusDeleteModal) {
        return;
    }

    try {

        await deleteProjectStatus(
            statusDeleteModal._id
        );

        setProjectStatuses(prev =>
            prev.filter(
                status =>
                    status._id !==
                    statusDeleteModal._id
            )
        );

        if (
            formData.status ===
            statusDeleteModal.name
        ) {

            setFormData(prev => ({

                ...prev,

                status: "",

            }));

        }

        setStatusDeleteModal(null);

        toast.success(
            "Project status removed successfully"
        );

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Failed to remove project status"
        );

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
    skill => skill.skill
);

return formData.requiredSkills.every(
    role =>
        employeeSkills.includes(role.skill)
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

                const payload = {

    ...formData,

    requiredSkills: formData.requiredSkills.map(role => ({

        skill: role.skill,

        resources: role.resources,
        roleCreatedAt:role.roleCreatedAt

    })),

};

await createProject(payload);

                toast.success("Project added successfully");

            } else {

               const payload = {

    ...formData,

    requiredSkills: formData.requiredSkills.map(role => ({

        skill: role.skill,

        resources: role.resources,
        roleCreatedAt:role.roleCreatedAt
    })),

};

await updateProject(project._id, payload);

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

                    <Select
    options={clientOptions}
    placeholder="Select Client..."
    value={
        clientOptions.find(
            option =>
                option.value === formData.client
        ) || null
    }
    onChange={(selected) =>
        setFormData(prev => ({
            ...prev,
            client: selected
                ? selected.value
                : "",
        }))
    }
    components={{
        Option: ClientOption,
        SingleValue: ClientSingleValue,
    }}
    isClearable
/>

                </div>
                <div className="form-group">

    <label>Reference</label>

    <input
        type="text"
        name="reference"
        value={formData.reference}
        onChange={handleChange}
        placeholder="Enter Reference"
    />

</div>
<div className="form-group full">

    <label>

        Brief Description / Summary

    </label>

    <textarea

        rows="4"

        name="description"

        value={formData.description}

        onChange={handleChange}

        placeholder="Brief description of the project..."

    />

</div>
<div className="form-group project-category-group">

    <div className="project-category-label-row">

        <label>
            Project Category
        </label>

        {!addingCategory ? (

            <button
                type="button"
                className="project-category-add-btn"
                onClick={() => {

                    setAddingCategory(true);

                    setCategoryDropdownOpen(false);

                }}
            >
                Add
            </button>

        ) : (

            <div className="project-category-action-buttons">

                <button
                    type="button"
                    className="project-category-cancel-btn"
                    onClick={() => {

                        setAddingCategory(false);

                        setNewCategory("");

                    }}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="project-category-submit-btn"
                    onClick={handleAddCategory}
                    disabled={savingCategory}
                >
                    {savingCategory
                        ? "Saving..."
                        : "Submit"}
                </button>

            </div>

        )}

    </div>


    {addingCategory ? (

        <input
            type="text"
            value={newCategory}
            onChange={(e) =>
                setNewCategory(e.target.value)
            }
            placeholder="Enter new project category"
            autoFocus
        />

    ) : (

        <div className="project-category-dropdown">

            <button
                type="button"
                className="project-category-dropdown-trigger"
                onClick={() =>
                    setCategoryDropdownOpen(
                        prev => !prev
                    )
                }
            >

                <span>

                    {formData.type ||
                        "Select Category"}

                </span>

                <span className="category-dropdown-arrow">
                    ▾
                </span>

            </button>


            {categoryDropdownOpen && (

                <div className="project-category-dropdown-menu">

                    {projectCategories.length === 0 ? (

                        <div className="project-category-empty">
                            No categories available
                        </div>

                    ) : (

                        projectCategories.map(
                            category => (

                                <div
                                    className="project-category-option"
                                    key={category._id}
                                >

                                    {editingCategoryId ===
                                    category._id ? (

                                        <div className="project-category-edit-row">

                                            <input
                                                type="text"
                                                value={
                                                    editingCategoryName
                                                }
                                                onChange={(e) =>
                                                    setEditingCategoryName(
                                                        e.target.value
                                                    )
                                                }
                                                autoFocus
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="category-save-icon"
                                                title="Save"
                                                disabled={
                                                    savingEditedCategory
                                                }
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    handleEditCategory();

                                                }}
                                            >
                                                ✓
                                            </button>

                                            <button
                                                type="button"
                                                className="category-cancel-icon"
                                                title="Cancel"
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    setEditingCategoryId(
                                                        null
                                                    );

                                                    setEditingCategoryName(
                                                        ""
                                                    );

                                                }}
                                            >
                                                ×
                                            </button>

                                        </div>

                                    ) : (

                                        <>

                                            <button
                                                type="button"
                                                className="project-category-name"
                                                onClick={() => {

                                                    setFormData(
                                                        prev => ({

                                                            ...prev,

                                                            type:
                                                                category.name,

                                                        })
                                                    );

                                                    setCategoryDropdownOpen(
                                                        false
                                                    );

                                                }}
                                            >

                                                {category.name}

                                            </button>


                                            <div className="project-category-icons">

                                                <button
                                                    type="button"
                                                    className="category-edit-icon"
                                                    title="Edit category"
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        setEditingCategoryId(
                                                            category._id
                                                        );

                                                        setEditingCategoryName(
                                                            category.name
                                                        );

                                                    }}
                                                >
                                                    ✎
                                                </button>


                                                <button
                                                    type="button"
                                                    className="category-delete-icon"
                                                    title="Delete category"
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        setCategoryDeleteModal(
                                                            category
                                                        );

                                                    }}
                                                >
                                                    🗑
                                                </button>

                                            </div>

                                        </>

                                    )}

                                </div>

                            )
                        )

                    )}

                </div>

            )}

        </div>

    )}

</div>
                <div className="form-group">

    <label>Project Start Date</label>

    <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
    />

</div>

<div className="form-group">

    <label>Project End Date</label>

    <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
    />

</div>
                <div className="form-group project-category-group">

    <div className="project-category-label-row">

        <label>
            Status
        </label>

        {!addingStatus ? (

            <button
                type="button"
                className="project-category-add-btn"
                onClick={() => {

                    setAddingStatus(true);

                    setStatusDropdownOpen(false);

                }}
            >
                Add
            </button>

        ) : (

            <div className="project-category-action-buttons">

                <button
                    type="button"
                    className="project-category-cancel-btn"
                    onClick={() => {

                        setAddingStatus(false);

                        setNewStatus("");

                    }}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="project-category-submit-btn"
                    onClick={handleAddStatus}
                    disabled={savingStatus}
                >
                    {savingStatus
                        ? "Saving..."
                        : "Submit"}
                </button>

            </div>

        )}

    </div>


    {addingStatus ? (

        <input
            type="text"
            value={newStatus}
            onChange={(e) =>
                setNewStatus(e.target.value)
            }
            placeholder="Enter new project status"
            autoFocus
        />

    ) : (

        <div className="project-category-dropdown">

            <button
                type="button"
                className="project-category-dropdown-trigger"
                onClick={() =>
                    setStatusDropdownOpen(
                        prev => !prev
                    )
                }
            >

                <span>

                    {formData.status ||
                        "Select Status"}

                </span>

                <span className="category-dropdown-arrow">
                    ▾
                </span>

            </button>


            {statusDropdownOpen && (

                <div className="project-category-dropdown-menu">

                    {projectStatuses.length === 0 ? (

                        <div className="project-category-empty">
                            No statuses available
                        </div>

                    ) : (

                        projectStatuses.map(
                            status => (

                                <div
                                    className="project-category-option"
                                    key={status._id}
                                >

                                    {editingStatusId ===
                                    status._id ? (

                                        <div className="project-category-edit-row">

                                            <input
                                                type="text"
                                                value={
                                                    editingStatusName
                                                }
                                                onChange={(e) =>
                                                    setEditingStatusName(
                                                        e.target.value
                                                    )
                                                }
                                                autoFocus
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="category-save-icon"
                                                title="Save"
                                                disabled={
                                                    savingEditedStatus
                                                }
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    handleEditStatus();

                                                }}
                                            >
                                                ✓
                                            </button>

                                            <button
                                                type="button"
                                                className="category-cancel-icon"
                                                title="Cancel"
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    setEditingStatusId(
                                                        null
                                                    );

                                                    setEditingStatusName(
                                                        ""
                                                    );

                                                }}
                                            >
                                                ×
                                            </button>

                                        </div>

                                    ) : (

                                        <>

                                            <button
                                                type="button"
                                                className="project-category-name"
                                                onClick={() => {

                                                    setFormData(
                                                        prev => ({

                                                            ...prev,

                                                            status:
                                                                status.name,

                                                        })
                                                    );

                                                    setStatusDropdownOpen(
                                                        false
                                                    );

                                                }}
                                            >

                                                {status.name}

                                            </button>


                                            <div className="project-category-icons">

                                                <button
                                                    type="button"
                                                    className="category-edit-icon"
                                                    title="Edit status"
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        setEditingStatusId(
                                                            status._id
                                                        );

                                                        setEditingStatusName(
                                                            status.name
                                                        );

                                                    }}
                                                >
                                                    ✎
                                                </button>


                                                <button
                                                    type="button"
                                                    className="category-delete-icon"
                                                    title="Delete status"
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        setStatusDeleteModal(
                                                            status
                                                        );

                                                    }}
                                                >
                                                    🗑
                                                </button>

                                            </div>

                                        </>

                                    )}

                                </div>

                            )
                        )

                    )}

                </div>

            )}

        </div>

    )}

</div>
<div className="form-group">

    <label>Role</label>

    <Select
    options={availableSkillOptions}
    placeholder="Select Role..."
    value={null}
    onChange={(role) => {

        if (!role) return;

        setSelectedRole(role);

        setEditingRoleIndex(null);

        setRoleModalOpen(true);

    }}
/>
<RoleResourceModal

    open={roleModalOpen}

    role={selectedRole}

    existingData={
        editingRoleIndex !== null
            ? formData.requiredSkills[editingRoleIndex]
            : null
    }

    onClose={() => {

        setRoleModalOpen(false);

    }}

    onSave={(roleData) => {

        const updated = [...formData.requiredSkills];

        if (editingRoleIndex !== null) {

            updated[editingRoleIndex] = roleData;

        } else {

            updated.push(roleData);

        }

        setFormData((prev) => ({

            ...prev,

            requiredSkills: updated,

        }));

        setRoleModalOpen(false);

    }}

/>
<AllocatedRolesTable

    roles={formData.requiredSkills}

    onEdit={(role) => {

        const index = formData.requiredSkills.findIndex(
            (item) => item.skill === role.skill
        );

        setEditingRoleIndex(index);

        setSelectedRole({
            value: role.skill,
            label: role.skillName,
        });

        setRoleModalOpen(true);

    }}

    onDelete={(skillId) => {

        setFormData((prev) => ({

            ...prev,

            requiredSkills:
                prev.requiredSkills.filter(
                    (item) => item.skill !== skillId
                ),

        }));

    }}

/>
</div>

{/* <div className="form-group">

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

</div> */}
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
{categoryDeleteModal && (

    <div
        className="category-delete-modal-overlay"
        onClick={() =>
            setCategoryDeleteModal(null)
        }
    >

        <div
            className="category-delete-modal"
            onClick={(e) =>
                e.stopPropagation()
            }
        >

            <h3>
                Delete Project Category?
            </h3>

            <p>

                Are you sure you want to remove

                <strong>
                    {" "}
                    {categoryDeleteModal.name}
                </strong>

                {" "}from the project category dropdown?

            </p>

            <p className="category-delete-warning">

                Existing projects using this category
                will not be affected.

            </p>


            <div className="category-delete-modal-actions">

                <button
                    type="button"
                    className="category-modal-cancel-btn"
                    onClick={() =>
                        setCategoryDeleteModal(null)
                    }
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="category-modal-delete-btn"
                    onClick={handleDeleteCategory}
                >
                    Delete
                </button>

            </div>

        </div>

    </div>

)}
{statusDeleteModal && (

    <div
        className="category-delete-modal-overlay"
        onClick={() =>
            setStatusDeleteModal(null)
        }
    >

        <div
            className="category-delete-modal"
            onClick={(e) =>
                e.stopPropagation()
            }
        >

            <h3>
                Delete Project Status?
            </h3>

            <p>

                Are you sure you want to remove

                <strong>
                    {" "}
                    {statusDeleteModal.name}
                </strong>

                {" "}from the project status dropdown?

            </p>

            <p className="category-delete-warning">

                Existing projects using this status
                will not be affected.

            </p>


            <div className="category-delete-modal-actions">

                <button
                    type="button"
                    className="category-modal-cancel-btn"
                    onClick={() =>
                        setStatusDeleteModal(null)
                    }
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="category-modal-delete-btn"
                    onClick={handleDeleteStatus}
                >
                    Delete
                </button>

            </div>

        </div>

    </div>

)}
            </form>

        </div>

    );

};

export default ProjectForm;