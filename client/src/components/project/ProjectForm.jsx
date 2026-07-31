import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    createProject,
    updateProject,
} from "../../services/projectService";

import { getClients } from "../../services/clientService";

const ProjectForm = ({
    mode = "add",
    project = null,
}) => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        client: "",
        status: "Active",
    });

    const [clients, setClients] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    useEffect(() => {

        if (mode === "edit" && project) {

            setFormData({
                name: project.name || "",
                client: project.client?._id || project.client || "",
                status: project.status || "Active",
            });

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

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

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

        <form onSubmit={submitHandler}>

            <div>

                <label>Project Name</label>

                <br />

                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                />

            </div>

            <br />

            <div>

                <label>Client</label>

                <br />

                <select
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
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

            <br />

            <div>

                <label>Status</label>

                <br />

                <select
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

            <br />

            <button
                type="submit"
                disabled={saving}
            >
                {saving
                    ? "Saving..."
                    : mode === "add"
                        ? "Add Project"
                        : "Update Project"}
            </button>

        </form>

    );

};

export default ProjectForm;