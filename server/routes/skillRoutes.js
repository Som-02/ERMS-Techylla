const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    getSkillMatrix
} = require("../controllers/skillController");

router.get("/", protect, getSkills);

router.get("/matrix", protect, getSkillMatrix);

router.post("/", protect, addSkill);

router.put("/:id", protect, updateSkill);

router.delete("/:id", protect, deleteSkill);

module.exports = router;