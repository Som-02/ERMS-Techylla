import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    createProject,
    updateProject,
} from "../../services/projectService";

import { getClients } from "../../services/clientService";

import "./project.css";

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

        setFormData(prev => ({
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