import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReasonDialog from "../../components/common/ReasonDialog";
import ReasonInputDialog from "../../components/common/ReasonInputDialog";
import {
    Check,
    X,
    RefreshCw,
    Eye,
    User,
    IdCard,
    Award,
    Tag,
    Star,
    Calendar,
    FileText,
    SlidersHorizontal,
} from "lucide-react";

import Loader from "../../components/common/Loader";

import ConfirmDialog from "../../components/common/ConfirmDialog";

import {
    getPendingSkillRequests,
    approveSkillRequest,
    rejectSkillRequest,
} from "../../services/skillRequestService";

import "./skillRequests.css";


const SkillRequests = () => {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [processingId, setProcessingId] =
        useState(null);


    /*
    ==========================================
    CONFIRMATION DIALOG
    ==========================================
    */

    const [showConfirmDialog, setShowConfirmDialog] =
        useState(false);

    const [selectedRequest, setSelectedRequest] =
        useState(null);
    const [reasonRequest,setReasonRequest]=useState(null);
    const [showReason,setShowReason]=useState(false);
    const [dialogAction, setDialogAction] =
        useState(null);
    const [approvalReason,setApprovalReason] =
    useState("");

const [showReasonInput,setShowReasonInput] =
    useState(false);

    // ==========================================
    // LOAD PENDING REQUESTS
    // ==========================================

    const loadRequests = async () => {

        try {

            setLoading(true);

            const res =
                await getPendingSkillRequests();

            setRequests(
                res.data || []
            );

        }

        catch (error) {

            console.error(
                "Failed to load skill requests:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load skill requests"
            );

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadRequests();

    }, []);


    // ==========================================
    // OPEN APPROVE DIALOG
    // ==========================================

    const openApproveDialog = (request)=>{

    setSelectedRequest(request);

    setDialogAction("APPROVE");

    setApprovalReason("");

    setShowReasonInput(true);

};


    // ==========================================
    // OPEN REJECT DIALOG
    // ==========================================

    const openRejectDialog=(request)=>{

    setSelectedRequest(request);

    setDialogAction("REJECT");

    setApprovalReason("");

    setShowReasonInput(true);

};


    // ==========================================
    // CANCEL CONFIRMATION
    // ==========================================

    const closeConfirmDialog = () => {

        if (processingId) {
            return;
        }

        setShowConfirmDialog(false);

        setSelectedRequest(null);

        setDialogAction(null);

    };


    // ==========================================
    // CONFIRM ACTION
    // ==========================================

    const confirmAction = async () => {

        if (
            !selectedRequest ||
            !dialogAction
        ) {

            return;

        }


        try {

            setProcessingId(
                selectedRequest._id
            );


            // ==================================
            // APPROVE
            // ==================================

            if (
                dialogAction === "APPROVE"
            ) {

                await approveSkillRequest(
                    selectedRequest._id,approvalReason
                );

                toast.success(
                    "Skill request approved successfully"
                );

            }


            // ==================================
            // REJECT
            // ==================================

            if (
                dialogAction === "REJECT"
            ) {

                await rejectSkillRequest(
                    selectedRequest._id,
                    approvalReason
                );

                toast.success(
                    "Skill request rejected"
                );

            }


            /*
            Remove the request from the
            pending table immediately.
            */

            setRequests(prev =>
                prev.filter(
                    item =>
                        item._id !==
                        selectedRequest._id
                )
            );


            /*
            Close dialog.
            */

            setShowConfirmDialog(false);

            setSelectedRequest(null);

            setDialogAction(null);

        }

        catch (error) {

            console.error(
                "Skill request action error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to process skill request"
            );

        }

        finally {

            setProcessingId(null);

        }

    };


    // ==========================================
    // REQUEST TYPE
    // ==========================================

    const getRequestLabel = (type) => {

        switch (type) {

            case "ADD":
                return "Add";

            case "UPDATE":
                return "Update";

            case "REMOVE":
                return "Remove";

            default:
                return type;

        }

    };


    // ==========================================
    // RATING DISPLAY
    // ==========================================

    const renderRating = (request) => {

        if (request.type === "ADD") {

            return (

                <span className="skill-rating">

                    {"★".repeat(
                        Number(
                            request.newRating
                        )
                    )}

                </span>

            );

        }


        if (request.type === "REMOVE") {

            return (

                <span className="skill-rating">

                    {"★".repeat(
                        Number(
                            request.oldRating
                        )
                    )}

                    {" → Removed"}

                </span>

            );

        }


        if (request.type === "UPDATE") {

            return (

                <span className="skill-rating">

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

                </span>

            );

        }


        return "-";

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return <Loader />;

    }


    // ==========================================
    // DIALOG CONTENT
    // ==========================================

    const dialogTitle =
        dialogAction === "APPROVE"
            ? "Confirm Approval"
            : "Confirm Rejection";


    const dialogMessage =
        selectedRequest
            ? dialogAction === "APPROVE"

                ? `Are you sure you want to approve the ${selectedRequest.type.toLowerCase()} request for "${selectedRequest.skill}" submitted by ${selectedRequest.employee?.name || "this employee"}?`

                : `Are you sure you want to reject the ${selectedRequest.type.toLowerCase()} request for "${selectedRequest.skill}" submitted by ${selectedRequest.employee?.name || "this employee"}?`

            : "";


    const dialogConfirmText =
        dialogAction === "APPROVE"
            ? "Approve"
            : "Reject";

    const openReason = (request)=>{

    setReasonRequest(request);

    setShowReason(true);

};
    return (

        <div className="skill-requests-page">


            {/* =================================
                CONFIRMATION DIALOG
            ================================= */}
<ReasonDialog

open={showReason}

title="Skill Change Reason"

reason={
    reasonRequest?.reason ||
    reasonRequest?.reviewReason ||
    "No reason provided"
}

readOnly={true}

onCancel={()=>{

    setShowReason(false);

    setReasonRequest(null);

}}

/>
            <ReasonInputDialog

open={showReasonInput}

title={
    dialogAction === "APPROVE"
    ?
    "Reason for Approval"
    :
    "Reason for Rejection"
}

reason={approvalReason}

setReason={setApprovalReason}

onCancel={()=>{

    setShowReasonInput(false);

    setApprovalReason("");

    setSelectedRequest(null);

}}

onSubmit={()=>{


if(!approvalReason.trim()){

    toast.error(
        "Reason is required"
    );

    return;

}


setShowReasonInput(false);

setShowConfirmDialog(true);


}}

/>
            <ConfirmDialog

                open={
                    showConfirmDialog
                }

                title={
                    dialogTitle
                }

                message={
                    dialogMessage
                }

                onCancel={
                    closeConfirmDialog
                }

                onConfirm={
                    confirmAction
                }

                confirmText={
                    dialogConfirmText
                }

                cancelText="Cancel"

            />


            {/* =================================
                HEADER
            ================================= */}

            <div className="skill-requests-header">

                <div>

                    <h1>
                        Role Requests
                    </h1>

                    <p>
                        Review and manage employee
                        role change requests.
                    </p>

                </div>


                <button
                    type="button"
                    className="refresh-btn"
                    onClick={
                        loadRequests
                    }
                    disabled={
                        loading ||
                        !!processingId
                    }
                >

                    <RefreshCw
                        size={17}
                    />

                    Refresh

                </button>

            </div>


            {/* =================================
                SUMMARY CARD
            ================================= */}

            <div className="request-summary-card">

                <div>

                    <span className="summary-label">

                        Pending Requests

                    </span>

                    <strong>

                        {requests.length}

                    </strong>

                </div>

            </div>


            {/* =================================
                REQUEST TABLE
            ================================= */}

            <div className="skill-request-table-card">

                {requests.length === 0 ? (

                    <div className="skill-request-empty">

                        <div className="empty-icon">

                            ✓

                        </div>

                        <h3>

                            No pending requests

                        </h3>

                        <p>

                            All employee role
                            changes have been reviewed.

                        </p>

                    </div>

                ) : (

                    <div className="skill-request-table-wrapper">

                        <table className="skill-request-table">

                            <colgroup>

                                <col
                                    style={{
                                        width: "15%"
                                    }}
                                />

                                <col
                                    style={{
                                        width: "7%"
                                    }}
                                />

                                <col
                                    style={{
                                        width: "20%"
                                    }}
                                />

                                <col
                                    style={{
                                        width: "10%"
                                    }}
                                />

                                <col
                                    style={{
                                        width: "10%"
                                    }}
                                />

                                <col
                                    style={{
                                        width: "15%"
                                    }}
                                />

                                <col
                                    style={{
                                        width: "10%"
                                    }}
                                />
                                <col
style={{
 width:"10%"
}}
/>
                            </colgroup>


                            <thead>

                                <tr>

                                    <th>
                                        <div className="th-content">
                                            <User size={15} />
                                            <span>Employee</span>
                                        </div>
                                    </th>

                                    <th>
                                        <div className="th-content">
                                            <IdCard size={15} />
                                            <span>Employee ID</span>
                                        </div>
                                    </th>

                                    <th>
                                        <div className="th-content">
                                            <Award size={15} />
                                            <span>Role</span>
                                        </div>
                                    </th>

                                    <th>
                                        <div className="th-content">
                                            <Tag size={15} />
                                            <span>Request</span>
                                        </div>
                                    </th>

                                    <th>
                                        <div className="th-content">
                                            <Star size={15} />
                                            <span>Rating</span>
                                        </div>
                                    </th>

                                    <th>
                                        <div className="th-content">
                                            <Calendar size={15} />
                                            <span>Requested On</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-content">
                                            <FileText size={15} />
                                            <span>Reason</span>
                                        </div>
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                        <div className="th-content" style={{ justifyContent: "center" }}>
                                            <SlidersHorizontal size={15} />
                                            <span>Actions</span>
                                        </div>
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {requests.map(
                                    (request) => {

                                        const isProcessing =
                                            processingId ===
                                            request._id;


                                        return (

                                            <tr
                                                key={
                                                    request._id
                                                }
                                            >


                                                {/* Employee */}

                                                <td>

                                                    <div className="employee-request-name">

                                                        <strong>

                                                            {
                                                                request.employee?.name ||
                                                                "-"
                                                            }

                                                        </strong>

                                                        <span>

                                                            {
                                                                request.employee?.position ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* Employee ID */}

                                                <td>

                                                    {
                                                        request.employee?.empId ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* Skill */}

                                                <td>

                                                    <strong className="skill-name">

                                                        {
                                                            request.skill
                                                        }

                                                    </strong>

                                                </td>


                                                {/* Request */}

                                                <td>

                                                    <span
                                                        className={
                                                            `request-type request-type-${request.type.toLowerCase()}`
                                                        }
                                                    >

                                                        {
                                                            getRequestLabel(
                                                                request.type
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* Rating */}

                                                <td>

                                                    {
                                                        renderRating(
                                                            request
                                                        )
                                                    }

                                                </td>


                                                {/* Date */}

                                                <td>

                                                    {request.createdAt

                                                        ? new Date(
                                                            request.createdAt
                                                        )
                                                            .toISOString()
                                                            .split("T")[0]

                                                        : "-"

                                                    }

                                                </td>
                                                
                                                <td>

<button

className="view-reason-btn"

onClick={() =>
    openReason(request)
}

>

<Eye size={17}/>

</button>

</td>

                                                {/* Actions */}

                                                <td
                                                    style={{
                                                        textAlign:
                                                            "center"
                                                    }}
                                                >

                                                    <div className="request-actions">


                                                        {/* APPROVE */}

                                                        <button
                                                            type="button"
                                                            className="approve-request-btn"
                                                            disabled={
                                                                isProcessing
                                                            }
                                                            onClick={() =>
                                                                openApproveDialog(
                                                                    request
                                                                )
                                                            }
                                                        >

                                                            Approve

                                                        </button>


                                                        {/* REJECT */}

                                                        <button
                                                            type="button"
                                                            className="reject-request-btn"
                                                            disabled={
                                                                isProcessing
                                                            }
                                                            onClick={() =>
                                                                openRejectDialog(
                                                                    request
                                                                )
                                                            }
                                                        >

                                                            Reject

                                                        </button>


                                                    </div>

                                                </td>


                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};


export default SkillRequests;