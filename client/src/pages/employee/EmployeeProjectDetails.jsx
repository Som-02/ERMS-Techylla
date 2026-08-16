import { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { getProject, getProjectStaffingPlan,} from "../../services/projectService";
import "../../pages/projects/projectDetails.css";
import { formatDate } from "../../utils/formatDate";

const ProjectDetails = () => {

    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [staffingPlan, setStaffingPlan] = useState([]);
    const [loading, setLoading] = useState(true);


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
to="/employee/projects"
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
        <col style={{ width: "20%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
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

</tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }




        </div>

    );

};

export default ProjectDetails;