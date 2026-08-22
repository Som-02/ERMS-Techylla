import { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { getProjectStaffingPlan } from "../../services/projectService";
import "./projectDetails.css";
import { formatDate } from "../../utils/formatDate";
import { UserPlus, Calendar, Building, Tag, FileText, CheckCircle2 } from "lucide-react";

const ProjectDetails = () => {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [staffingPlan, setStaffingPlan] = useState([]);
    const [loading, setLoading] = useState(true);

    const descriptionRef = useRef(null);
    const [showHint, setShowHint] = useState(false);

    const handleDescriptionScroll = () => {
        const el = descriptionRef.current;
        if (!el) return;

        const isScrollable = el.scrollHeight > el.clientHeight;
        if (!isScrollable) {
            setShowHint(false);
            return;
        }

        const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
        setShowHint(!reachedBottom);
    };

    useEffect(() => {
        const checkDescription = () => {
            const el = descriptionRef.current;
            if (!el) return;
            const isScrollable = el.scrollHeight > el.clientHeight;
            setShowHint(isScrollable);
        };

        checkDescription();
        window.addEventListener("resize", checkDescription);
        return () => window.removeEventListener("resize", checkDescription);
    }, [project]);

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {
        try {
            const res = await getProjectStaffingPlan(id);
            setProject(res.data.project);
            setStaffingPlan(res.data.staffingPlan || []);
        } catch (error) {
            console.error("Failed to load project details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!project) {
        return (
            <div className="project-details">
                <Link className="back-link" to="/projects">
                    ← Back to Projects
                </Link>
                <h2>Project Not Found</h2>
            </div>
        );
    }

    const assignedCount = staffingPlan.filter((slot) => slot.employee).length;

    const getStatusClass = (status) => {
        switch (status) {
            case "Lead":
                return "lead";
            case "Pipeline":
                return "pipeline";
            case "Active":
                return "active";
            case "Completed":
                return "completed";
            case "On Hold":
                return "hold";
            default:
                return "custom";
        }
    };

    return (
        <div className="project-details">
            <Link className="back-link" to="/projects">
                ← Back to Projects
            </Link>

            <div className="project-header-container">
                <div className="project-header-left">
                    <h1>{project.name}</h1>
                    <div className="status-below-container">
                        <span className={`status ${getStatusClass(project.status)}`}>
                            <span className="status-dot"></span>
                            {project.status}
                        </span>
                    </div>
                </div>

                <div className="project-header-right">
                    <Link to={`/projects/${project._id}/assign`} className="project-btn project-assign-btn">
                        <UserPlus size={16} />
                        <span>Assign Employees</span>
                    </Link>
                </div>
            </div>

            <div className="project-card">
                <div className="detail">
                    <span>Client</span>
                    <strong>{project.client?.name || "-"}</strong>
                </div>

                <div className="detail">
                    <span>Reference</span>
                    <strong>{project.reference || "-"}</strong>
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
                    {showHint && <div className="scroll-hin">Scroll for more...</div>}
                </div>

                <div className="detail">
                    <span>Project Category</span>
                    <strong>{project.type || "-"}</strong>
                </div>

                <div className="detail">
                    <span>Duration</span>
                    <strong>
                        {project.startDate ? formatDate(project.startDate) : "-"}
                        {"  --  "}
                        {project.endDate ? formatDate(project.endDate) : "-"}
                    </strong>
                </div>

                <div className="detail">
                    <span>Employees Assigned</span>
                    <strong>{assignedCount} / {staffingPlan.length} Roles Filled</strong>
                </div>
            </div>

            {/* Required Skills & Roles Overview */}
            {project.requiredSkills && project.requiredSkills.length > 0 && (
                <div className="project-skills-summary">
                    <h2>Required Roles & Skills</h2>
                    <div className="skills-badge-list">
                        {project.requiredSkills.map((req, idx) => {
                            const totalQty =
                                (Number(req.resources?.onshore) || 0) +
                                (Number(req.resources?.offshore) || 0) ||
                                req.quantity ||
                                1;

                            return (
                                <div key={idx} className="skill-badge-item">
                                    <span className="skill-role-name">{req.skill?.name || "Skill"}</span>
                                    <span className="skill-role-count">Qty: {totalQty}</span>
                                    {req.resources && (
                                        <span className="skill-role-loc">
                                            ({req.resources.onshore || 0} Onshore / {req.resources.offshore || 0} Offshore)
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;