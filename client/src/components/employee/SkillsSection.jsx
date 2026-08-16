import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

import {
    Pencil,
    Trash2,
    Eye,
} from "lucide-react";

import { getSkills } from "../../services/skillService";

import {
    createSkillRequest,
    getMySkillRequests,
} from "../../services/skillRequestService";

import "./employeeSection.css";
import ReasonDialog from "../common/ReasonDialog";

const SkillsSection = ({
    skills,
    setSkills,
}) => {
    const { user } = useAuth();

    const isAdmin =
        user?.role === "Administrator";
    const [skill, setSkill] = useState("");

    const [rating, setRating] = useState(1);
    const [showReasonDialog,setShowReasonDialog]=useState(false);
    const [requestReason,setRequestReason]=useState("");
    const [pendingRequestData,setPendingRequestData]=useState(null);
    const [showViewReason,setShowViewReason] = useState(false);
    const [selectedReason,setSelectedReason] = useState("");
    const [availableSkills, setAvailableSkills] =
        useState([]);

    const [pendingRequests, setPendingRequests] =
        useState([]);
    const openReasonView = (reason) => {

    setSelectedReason(
        reason || "No reason provided"
    );

    setShowViewReason(true);

    };
    /*
    Used when editing an existing skill.
    */

    const [editingSkill, setEditingSkill] =
        useState(null);


    // ==========================================
    // LOAD AVAILABLE SKILLS + REQUESTS
    // ==========================================

    useEffect(() => {

    loadSkills();

    if (!isAdmin) {
        loadPendingRequests();
    }

}, [isAdmin]);


    const loadSkills = async () => {

        try {

            const res =
                await getSkills();

            setAvailableSkills(
                res.data || []
            );

        }

        catch (error) {

            console.error(
                "Failed to load skills:",
                error
            );

        }

    };


    const loadPendingRequests = async () => {

        try {

            const res =
                await getMySkillRequests();

            /*
            We only want PENDING requests
            in this card.
            */

            const pending =
                (res.data || []).filter(
                    request =>
                        request.status === "PENDING"
                );

            setPendingRequests(pending);

        }

        catch (error) {

            console.error(
                "Failed to load role requests:",
                error
            );

        }

    };


    // ==========================================
    // RESET TOP FORM
    // ==========================================

    const resetForm = () => {

        setSkill("");

        setRating(1);
        setReason("");
        setEditingSkill(null);

    };


    // ==========================================
    // ADD / UPDATE SKILL REQUEST
    // ==========================================

    const handleSubmitSkill = async () => {
    
    if (!skill) {

        toast.error("Please select a role");

        return;

    }

    // ==========================================
    // ADMINISTRATOR
    // ==========================================

    if (isAdmin) {

        // --------------------------------------
        // UPDATE EXISTING SKILL
        // --------------------------------------

        if (editingSkill) {

            setSkills((prev) =>
                prev.map((item) =>
                    item.skill === editingSkill.skill
                        ? {
                              ...item,
                              rating: Number(rating),
                          }
                        : item
                )
            );

            toast.success(
                "Role updated successfully"
            );

            resetForm();

            return;
        }


        // --------------------------------------
        // ADD NEW SKILL
        // --------------------------------------

        const exists = skills.some(
            (item) =>
                item.skill.toLowerCase() ===
                skill.toLowerCase()
        );

        if (exists) {

            toast.error(
                "Role already exists"
            );

            return;

        }


        setSkills((prev) => [
            ...prev,
            {
                skill,
                rating: Number(rating),
            },
        ]);

        toast.success(
            "Role added successfully"
        );

        resetForm();

        return;
    }


    // ==========================================
    // EMPLOYEE
    // ==========================================
    setPendingRequestData({

    type: editingSkill
        ? "UPDATE"
        : "ADD",

    skill:
        editingSkill
        ? editingSkill.skill
        : skill,

    oldRating:
        editingSkill
        ? Number(editingSkill.rating)
        : null,

    newRating:
        Number(rating)

});


setShowReasonDialog(true);

return;
    // ------------------------------------------
    // UPDATE EXISTING SKILL REQUEST
    // ------------------------------------------

    if (editingSkill) {

        if (
            Number(editingSkill.rating) ===
            Number(rating)
        ) {

            toast.error(
                "Please change the rating"
            );

            return;

        }


        try {

            await createSkillRequest({

                type: "UPDATE",

                skill: editingSkill.skill,

                oldRating:
                    Number(
                        editingSkill.rating
                    ),

                newRating:
                    Number(rating),
                reason,
            });


            toast.success(
                "Skill update request submitted"
            );


            resetForm();

            await loadPendingRequests();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||
                "Failed to submit skill update request"

            );

        }

        return;
    }


    // ------------------------------------------
    // ADD NEW SKILL REQUEST
    // ------------------------------------------

    const exists = skills.some(
        (item) =>
            item.skill.toLowerCase() ===
            skill.toLowerCase()
    );


    if (exists) {

        toast.error(
            "Role already exists"
        );

        return;

    }


    try {

        await createSkillRequest({

            type: "ADD",

            skill,

            oldRating: null,

            newRating:
                Number(rating),
            reason,
        });


        toast.success(
            "Skill addition request submitted"
        );


        resetForm();

        await loadPendingRequests();

    }

    catch (error) {

        toast.error(

            error.response?.data?.message ||
            "Failed to submit role request"

        );

    }

};


    // ==========================================
    // EDIT EXISTING SKILL
    // ==========================================

    const editSkill = (item) => {

        setEditingSkill(item);

        setSkill(item.skill);

        setRating(
            Number(item.rating)
        );

        /*
        Scroll to the top of this section
        so user can immediately see the
        Skill + Rating fields.
        */

        window.scrollTo({

            top:
                window.scrollY - 100,

            behavior: "smooth",

        });

    };


    // ==========================================
    // REMOVE SKILL REQUEST
    // ==========================================

    const removeSkill = async (item) => {

    // ==========================================
    // ADMINISTRATOR
    // ==========================================

    if (isAdmin) {

        setSkills((prev) =>
            prev.filter(
                (skillItem) =>
                    skillItem.skill !== item.skill
            )
        );

        toast.success(
            "Role removed successfully"
        );

        return;
    }


    // ==========================================
    // EMPLOYEE
    // ==========================================
    setPendingRequestData({

    type:"REMOVE",

    skill:item.skill,

    oldRating:Number(item.rating),

    newRating:null

});


setShowReasonDialog(true);

return;
    const alreadyPending =
        pendingRequests.some(
            (request) =>
                request.skill.toLowerCase() ===
                item.skill.toLowerCase()
        );


    if (alreadyPending) {

        toast.error(
            "A pending request already exists for this skill"
        );

        return;

    }


    try {

        await createSkillRequest({

            type: "REMOVE",

            skill: item.skill,

            oldRating:
                Number(item.rating),

            newRating: null,
            reason,
        });


        toast.success(
            "Skill removal request submitted"
        );


        await loadPendingRequests();

    }

    catch (error) {

        toast.error(

            error.response?.data?.message ||

            "Failed to submit role removal request"

        );

    }

};


    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const cancelEdit = () => {

        resetForm();

    };


    return (

        <>

            {/* =====================================
                SKILL INPUT SECTION
            ====================================== */}

            <div className="section-grid">

                <div className="field">

                    <label>
                        Role
                    </label>

                    <select
                        value={skill}
                        onChange={(e) =>
                            setSkill(
                                e.target.value
                            )
                        }
                        disabled={
                            !!editingSkill
                        }
                    >

                        <option value="">
                            Select Role
                        </option>

                        {availableSkills.map(
                            (item) => (

                                <option
                                    key={
                                        item._id
                                    }
                                    value={
                                        item.name
                                    }
                                >

                                    {item.name}

                                </option>

                            )
                        )}

                    </select>

                </div>

                <div className="field">

                    <label>
                        Rating
                    </label>

                    <select
                        value={rating}
                        onChange={(e) =>
                            setRating(
                                Number(
                                    e.target.value
                                )
                            )
                        }
                    >

                        <option value={1}>
                            1 ★
                        </option>

                        <option value={2}>
                            2 ★★
                        </option>

                        <option value={3}>
                            3 ★★★
                        </option>

                        <option value={4}>
                            4 ★★★★
                        </option>

                        <option value={5}>
                            5 ★★★★★
                        </option>

                    </select>

                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                    }}
                >

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={
                            handleSubmitSkill
                        }
                    >

                        {editingSkill
                            ? "Update"
                            : "+ Add"}

                    </button>


                    {editingSkill && (

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={
                                cancelEdit
                            }
                        >

                            Cancel

                        </button>

                    )}

                </div>

            </div>


            {/* =====================================
                CURRENT SKILLS
            ====================================== */}

            {skills.length === 0 ? (

                <div className="empty">

                    No roles added

                </div>

            ) : (

                <table className="data-table">

                    <thead>

                        <tr>

                            <th>
                                Role
                            </th>

                            <th>
                                Rating
                            </th>

                            <th
                                style={{
                                    textAlign:
                                        "right", paddingRight:"35px",
                                }}
                            >
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {skills.map(
                            (item, index) => (

                                <tr
                                    key={
                                        index
                                    }
                                >

                                    <td>
                                        {
                                            item.skill
                                        }
                                    </td>


                                    <td>

                                        {"★".repeat(
                                            Number(
                                                item.rating
                                            )
                                        )}

                                    </td>


                                    <td
                                        style={{
                                            textAlign:
                                                "right",
                                        }}
                                    >

                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "flex-end",
                                                gap:
                                                    "8px",
                                            }}
                                        >

                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                className="skill-edit-btn"
                                                onClick={() =>
                                                    editSkill(
                                                        item
                                                    )
                                                }
                                                title="Edit Skill"
                                            >

                                                <Pencil
                                                    size={
                                                        18
                                                    }
                                                />

                                            </button>


                                            {/* REMOVE */}

                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() =>
                                                    removeSkill(
                                                        item
                                                    )
                                                }
                                                title="Request Skill Removal"
                                            >

                                                <Trash2
                                                    size={
                                                        18
                                                    }
                                                />

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            )}


            {/* =====================================
                PENDING REQUESTS
            ====================================== */}

            {!isAdmin && pendingRequests.length > 0 && (

    <div className="pending-skill-card">

        <div className="pending-skill-header">

            <div>

                <h3>
                    Pending Role Requests
                </h3>

                <p>
                    These changes are waiting for
                    administrator approval.
                </p>

            </div>

            <span className="pending-count">
                {pendingRequests.length}
            </span>

        </div>


        <div className="pending-table-wrapper">

            <table className="pending-skill-table">

                <thead>

                    <tr>

                        <th>
                            Role
                        </th>

                        <th>
                            Request
                        </th>

                        <th>
                            Rating
                        </th>
                        
                        <th>
                            Reason
                        </th>

                        <th>
                            Status
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {pendingRequests.map(
                        (request) => (

                            <tr
                                key={
                                    request._id
                                }
                            >

                                <td>
                                    {request.skill}
                                </td>


                                <td>

                                    {request.type ===
                                        "ADD" &&
                                        "Add"}

                                    {request.type ===
                                        "REMOVE" &&
                                        "Remove"}

                                    {request.type ===
                                        "UPDATE" &&
                                        "Update"}

                                </td>


                                <td>

                                    {request.type ===
                                        "ADD" && (

                                        <>
                                           

                                            {"★".repeat(
                                                Number(
                                                    request.newRating
                                                )
                                            )}

                                        </>

                                    )}


                                    {request.type ===
                                        "REMOVE" && (

                                        <>
                                            {"★".repeat(
                                                Number(
                                                    request.oldRating
                                                )
                                            )}

                                            {" → Removed"}

                                        </>

                                    )}


                                    {request.type ===
                                        "UPDATE" && (

                                        <>
                                            {"★".repeat(
                                                Number(
                                                    request.oldRating
                                                )
                                            )}

                                            {" → "}

                                            {"★".repeat(
                                                Number(
                                                    request.newRating
                                                )
                                            )}

                                        </>

                                    )}

                                </td>

                                <td>

    <button

        type="button"

        className="view-reason-btn"

        onClick={() =>
            openReasonView(
                request.reason
            )
        }

    >

        <Eye size={17}/>

    </button>

</td>

                                <td>

                                    <span className="pending-status">

                                        Pending

                                    </span>

                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>

    </div>

)}
<ReasonDialog

    open={showViewReason}

    title="Skill Change Reason"

    reason={selectedReason}

    setReason={()=>{}}

    onCancel={()=>{

        setShowViewReason(false);

        setSelectedReason("");

    }}

    readOnly={true}

/>
<ReasonDialog

open={showReasonDialog}

title="Reason for Skill Change"

reason={requestReason}

setReason={setRequestReason}


onCancel={()=>{

setShowReasonDialog(false);

setRequestReason("");

}}


onSubmit={async()=>{


if(!requestReason.trim()){

toast.error(
"Reason is required"
);

return;

}


try{


await createSkillRequest({

    ...pendingRequestData,

    reason:requestReason

});


toast.success(
"Skill request submitted"
);


setShowReasonDialog(false);

setRequestReason("");

setPendingRequestData(null);

loadPendingRequests();


}

catch(error){

toast.error(
error.response?.data?.message ||
"Request failed"
);

}



}}

/>
        </>

    );

};


export default SkillsSection;