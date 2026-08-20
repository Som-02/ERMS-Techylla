const express = require("express");

const router = express.Router();
const upload = require("../middleware/uploadExcel");

const { previewImport,importExcel} = require("../controllers/projectImportController");
const { protect } = require("../middleware/authMiddleware");

const {

    getProjects,
    getMyProjects,
    exportProjects,
    getProject,
    getProjectStaffingPlan,
    createProject,
    createProjectCategory,
    getProjectCategories,
    updateProjectCategory,
    deleteProjectCategory,
    createProjectStatus,
    getProjectStatuses,
    updateProjectStatus,
    deleteProjectStatus,
    updateProject,
    updateAssignment,
    deleteAssignment,
    deleteProject,
    searchProjects,
    assignEmployee,

} = require("../controllers/projectController");

router.get("/", protect, getProjects);
router.get(
    "/categories",
    protect,
    getProjectCategories
);
router.post(
    "/categories",
    protect,
    createProjectCategory
);

router.put(
    "/categories/:id",
    protect,
    updateProjectCategory
);

router.delete(
    "/categories/:id",
    protect,
    deleteProjectCategory
);

router.get(
    "/statuses",
    protect,
    getProjectStatuses
);

router.post(
    "/statuses",
    protect,
    createProjectStatus
);

router.put(
    "/statuses/:id",
    protect,
    updateProjectStatus
);

router.delete(
    "/statuses/:id",
    protect,
    deleteProjectStatus
);

router.get(
    "/my-projects",
    protect,
    getMyProjects
);
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
    protect,
    deleteAssignment
);
router.delete("/:id", protect, deleteProject);

module.exports = router;