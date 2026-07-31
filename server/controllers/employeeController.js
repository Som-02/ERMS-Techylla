const Employee = require("../models/Employee");

// ==========================
// Get All Employees
// ==========================
const getEmployees = async (req, res) => {
  try {
   const employees = await Employee.find()
    .populate("reportingManager", "name")
    .populate("assignments.client")
    .populate("assignments.project").sort({
    createdAt:-1
});

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Employee By ID
// ==========================
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
    .populate("reportingManager", "name")
    .populate("assignments.client", "name")
    .populate("assignments.project", "name");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Create Employee
// ==========================

const createEmployee = async (req, res) => {
  try {

    const exists = await Employee.findOne({
      empId: req.body.empId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already exists",
      });
    }
if (!req.body.reportingManager) {
    req.body.reportingManager = null;
}
    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      message: "Employee Created",
      data: employee,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================
// Update Employee
// ==========================
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
console.log(
    "Assignments received:",
    JSON.stringify(req.body.assignments, null, 2)
);
    res.status(200).json({
      
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Employee
// ==========================
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchEmployees = async (req, res) => {

    try {

        const q = req.query.q || "";

        const employees = await Employee.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { empId: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
                {
                    "skills.skill": {
                        $regex: q,
                        $options: "i",
                    },
                },
            ],
        })
            .populate("reportingManager", "name")
.populate("assignments.client", "name")
.populate("assignments.project", "name");

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
};