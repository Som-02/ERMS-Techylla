const express = require("express");

const router = express.Router();
const upload = require("../middleware/uploadExcel");

const { previewImport,importExcel} = require("../controllers/projectImportController");
const { protect } = require("../middleware/authMiddleware");

const {

    getProjects,
    exportProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    searchProjects

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
router.get("/:id", protect, getProject);
router.put("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);

module.exports = router;