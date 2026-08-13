const express = require("express");

const router = express.Router();

const {
    protect,
} = require("../middleware/authMiddleware");

const {
    createSkillChangeRequest,
    getMySkillChangeRequests,
    getPendingSkillChangeRequests,
    approveSkillChangeRequest,
    rejectSkillChangeRequest,
} = require("../controllers/skillChangeRequestController");


// ==========================================
// EMPLOYEE
// ==========================================

router.post(
    "/",
    protect,
    createSkillChangeRequest
);

router.get(
    "/my",
    protect,
    getMySkillChangeRequests
);


// ==========================================
// ADMIN
// ==========================================

router.get(
    "/pending",
    protect,
    getPendingSkillChangeRequests
);

router.put(
    "/:id/approve",
    protect,
    approveSkillChangeRequest
);

router.put(
    "/:id/reject",
    protect,
    rejectSkillChangeRequest
);


module.exports = router;