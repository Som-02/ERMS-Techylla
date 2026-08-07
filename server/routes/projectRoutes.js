const express = require("express");

const router = express.Router();
const upload = require("../middleware/uploadExcel");

const { previewImport,importExcel} = require("../controllers/projectImportController");
const { protect } = require("../middleware/authMiddleware");

const {

    getProjects,
    exportProjects,
    getProject,
    getProjectStaffingPlan,
    createProject,
    updateProject,
    updateAssignment,
    deleteAssignment,
    deleteProject,
    searchProjects,
    assignEmployee,

} = require("../controllers/projectController");

router.get("/", protect, getProjects);

router.get("/search", protect, searchProjects);

router.post("/", protect, createProject);
router.get(
    "/export",
    protect,
    exportProjects
);
router.post(

    "/import/preview",

    protect,

    upload.single("file"),

    previewImport

);
router.post(
    "/import",
    protect,
    upload.single("file"),
    importExcel
);
router.post(

    "/:projectId/assignment",

    protect,

    assignEmployee

);
router.get(

    "/:id/staffing-plan",

    protect,

    getProjectStaffingPlan

);
router.get("/:id", protect, getProject);
router.put("/:id", protect, updateProject);
router.put(

    "/:projectId/assignment/:employeeId",

    protect,

    updateAssignment

);
router.delete(
    "/:projectId/assign/:employeeId/:role",
    deleteAssignment
);
router.delete("/:id", protect, deleteProject);

module.exports = router;