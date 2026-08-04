import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import PageHeader from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ProjectTable from "../../components/project/ProjectTable";
import {previewProjectImport,importProjectsExcel,} from "../../services/projectImportService";
import exportProjects from "../../utils/exportProjects";
import { getProjectsForExport } from "../../services/projectService";
import {
    getProjects,
    searchProjects,
    deleteProject,
} from "../../services/projectService";

const Projects = () => {
    const fileInputRef = useRef(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedProject, setSelectedProject] = useState(null);
    const [search, setSearch] = useState("");
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {

        try {

            const res = await getProjects();

            setProjects(res.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleSearch = async (query) => {

        if (!query.trim()) {

            loadProjects();

            return;

        }

        const res = await searchProjects(query);

        setProjects(res.data);

    };

    const openDeleteDialog = (project) => {

        setSelectedProject(project);

        setShowDialog(true);

    };
    const handleExport = async () => {

    try {

        const res = await getProjectsForExport();

        await exportProjects(res.data);

        toast.success("Projects exported successfully");

    }

    catch (error) {

        toast.error("Export failed");

    }

};
const handleImport = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

        // Step 1 - Preview
        const preview = await previewProjectImport(file);

        if (!preview.success) {

            toast.error("Validation failed.");

            console.log(preview.errors);

            return;

        }

        // Step 2 - Import
        const result = await importProjectsExcel(file);

        console.log(result);

        toast.success("Projects imported successfully.");

        loadProjects();

    }

    catch (error) {

        console.log(error);

        toast.error(

            error.response?.data?.message ||

            "Import failed"

        );

    }

};
    const handleDelete = async () => {

        try {

            await deleteProject(selectedProject._id);

            toast.success("Project Deleted");

            setShowDialog(false);

            loadProjects();

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Delete failed"

            );

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <>
            
            <PageHeader
    title="Projects"
    subtitle="Manage and monitor all company projects."
    thirdButtonText="Import Excel"
    onThirdClick={() => fileInputRef.current.click()}
    secondaryButtonText="Export Excel"
    onSecondaryClick={handleExport}

    buttonText="Add Project"
    buttonLink="/projects/add"
/>
<input

    type="file"

    accept=".xlsx"

    ref={fileInputRef}

    style={{ display: "none" }}

    onChange={handleImport}

/>

            <div style={{ marginBottom: "24px" }}>

                <SearchBar
                    value={search}
                    placeholder="Search projects..."
                    onChange={(e) => {

                        const value = e.target.value;

                        setSearch(value);

                        handleSearch(value);

                    }}
                />

            </div>

            <ProjectTable
                projects={projects}
                onDelete={openDeleteDialog}
            />

            <ConfirmDialog
                open={showDialog}
                title="Delete Project"
                message="Are you sure you want to delete this project?"
                onConfirm={handleDelete}
                onCancel={() => setShowDialog(false)}
            />

        </>

    );

};

export default Projects;