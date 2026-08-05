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
import EditAssignmentModal from "../../components/project/AssignmentModal";
const Projects = () => {
    const fileInputRef = useRef(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal,setShowEditModal]=useState(false);
    const [selectedAssignment,setSelectedAssignment]=useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [search, setSearch] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);
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

        setExporting(true);

        const res = await getProjectsForExport();

        await exportProjects(res.data);

        toast.success("Projects exported successfully");

    }

    catch (error) {

        toast.error("Export failed");

    }

    finally {

        setExporting(false);

    }

};
const handleImport = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

        setImporting(true);

        const res = await previewProjectImport(file);

        console.log(res);

        toast.success("Excel validated successfully.");

    }

    catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Import failed"
        );

    }

    finally {

        setImporting(false);

        e.target.value = "";
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

    thirdButtonText={
        importing
            ? "⬆️ Importing Excel..."
            : "Import Excel"
    }

    onThirdClick={() => {

        if (!importing)
            fileInputRef.current.click();

    }}

    secondaryButtonText={
        exporting
            ? "⬇️ Exporting Excel..."
            : "Export Excel"
    }

    onSecondaryClick={
        exporting
            ? undefined
            : handleExport
    }

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