const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const validateEmployee = require("../middleware/validateEmployee");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} = require("../controllers/employeeController");

router.get(
    "/search",
    protect,
    searchEmployees
);

router.get("/:id", protect, getEmployeeById);
router.get("/", protect, getEmployees);
router.post(
    "/",
    protect,
    validateEmployee,
    createEmployee
);

router.put("/:id", protect, updateEmployee);

router.delete("/:id", protect, deleteEmployee);

module.exports = router;