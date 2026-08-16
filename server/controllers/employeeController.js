const Employee = require("../models/Employee");
const Skill = require("../models/Skill");
const Project = require("../models/Project");
const {
    notifyAdministrators,
    escapeHtml,
} = require("../services/notificationService");
// const {

//     assignEmployeeToProject,

// } = require("../services/assignmentService");
/*
==========================================
HELPER
==========================================
*/

const enrichEmployee = (employee) => {

    const assignments =
        employee.assignments || [];

    const totalProjects =
        assignments.length;

    const startDates =
        assignments
            .filter(a => a.startDate)
            .map(a => new Date(a.startDate));

    const endDates =
        assignments
            .filter(a => a.endDate)
            .map(a => new Date(a.endDate));

    const totalAllocation =
        assignments.reduce(

            (sum, assignment) =>
                sum + (assignment.allocation || 0),

            0

        );

    return {

        ...employee.toObject(),

        totalProjects,

        lowestStartDate:

            startDates.length > 0

                ? new Date(
                    Math.min(...startDates)
                )

                : null,

        highestEndDate:

            endDates.length > 0

                ? new Date(
                    Math.max(...endDates)
                )

                : null,

        totalAllocation,

    };

};

/*
==========================================
Get All Employees
==========================================
*/

const getEmployees = async (req, res) => {

    try {

        let employees = await Employee.find()

            .populate("reportingManager", "name")

            .populate("assignments.client")

            .populate("assignments.project")

            .sort({

                createdAt: -1,

            });

        employees = employees.map(enrichEmployee);

        res.status(200).json({

            success: true,

            count: employees.length,

            data: employees,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

/*
==========================================
Get Employee By ID
==========================================
*/

const getEmployeeById = async (req, res) => {

    try {

        const employee = await Employee.findById(req.params.id)

            .populate("reportingManager", "name")

            .populate("assignments.client", "name logo")

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

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
/*
==========================================
Get Logged In Employee
==========================================
*/

const getMyEmployee = async (req, res) => {

    try {

        const employee = await Employee.findById(req.user.id)
            .populate("reportingManager", "name")
            .populate("assignments.client", "name logo")
            .populate("assignments.project", "name");

        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        const enrichedEmployee =
            enrichEmployee(employee);

        return res.status(200).json({

            success: true,
            data: enrichedEmployee

        });

    } catch (error) {

        console.error(
            "Get my employee error:",
            error
        );

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
/*
==========================================
Create Employee
==========================================
*/

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

        // const {

        //     assignments = [],

        //     ...employeeData

        // } = req.body;
        const employeeData = req.body;
        if (!employeeData.reportingManager) {

            employeeData.reportingManager = null;

        }

        // -----------------------------
        // Create employee WITHOUT assignments
        // -----------------------------

        // const employee = await Employee.create({

        //     ...employeeData,

        //     assignments: [],

        // });
const employee = await Employee.create(employeeData);
        // -----------------------------
        // Assign projects using common service
        // -----------------------------

        // for (const assignment of assignments) {

        //     await assignEmployeeToProject({

        //         employeeId: employee._id,

        //         projectId: assignment.project,

        //         role: assignment.role,

        //         location: assignment.location,

        //         startDate: assignment.startDate,

        //         endDate: assignment.endDate,

        //         allocation: assignment.allocation,

        //     });

        // }

        const createdEmployee = await Employee.findById(employee._id)

            .populate("reportingManager", "name")

            .populate("assignments.client", "name logo")

            .populate("assignments.project", "name");

        res.status(201).json({

            success: true,

            message: "Employee Created",

            data: createdEmployee,

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

/*
==========================================
Update Employee
==========================================
*/

const updateEmployee = async (req, res) => {

    try {

        // const {

        //     assignments = [],

        //     ...employeeData

        // } = req.body;
        const employeeData = req.body;
        const employee = await Employee.findById(req.params.id);

        if (!employee) {

            return res.status(404).json({

                success: false,

                message: "Employee not found",

            });

        }
        const oldSkills =
    (employee.skills || []).map(
        skill => ({
            skill:
                skill.skill,

            rating:
                Number(skill.rating),
        })
    );
        // -----------------------------
        // Update employee basic details
        // -----------------------------

        employee.empId = employeeData.empId;
        employee.name = employeeData.name;
        employee.email = employeeData.email;
        employee.mobile = employeeData.mobile;
        employee.location = employeeData.location;
        employee.position = employeeData.position;
        employee.experience = employeeData.experience;
        employee.reportingManager = employeeData.reportingManager || null;
        employee.skills = employeeData.skills || [];

        // -----------------------------
        // Remove employee from all projects
        // -----------------------------

        // await Project.updateMany(

        //     {},

        //     {

        //         $pull: {

        //             assignedEmployees: employee._id,

        //         },

        //     }

        // );

        // // -----------------------------
        // // Clear old assignments
        // // -----------------------------

        // employee.assignments = [];

        // await employee.save();

        // // -----------------------------
        // // Recreate assignments
        // // -----------------------------

        // for (const assignment of assignments) {

        //     await assignEmployeeToProject({

        //         employeeId: employee._id,

        //         projectId: assignment.project,

        //         role: assignment.role,

        //         location: assignment.location,

        //         startDate: assignment.startDate,

        //         endDate: assignment.endDate,

        //         allocation: assignment.allocation,

        //     });

        // }
        employee.skills = employeeData.skills || [];
        await employee.save();
        /*
==================================================
ADMIN SKILL CHANGE NOTIFICATION
==================================================
*/

const newSkills =
    (employee.skills || []).map(
        skill => ({
            skill:
                skill.skill,

            rating:
                Number(skill.rating),
        })
    );


const skillsChanged =
    JSON.stringify(oldSkills) !==
    JSON.stringify(newSkills);


if (
    skillsChanged &&
    req.user?.role ===
        "Administrator"
) {

    const addedSkills =
        newSkills.filter(
            newSkill =>
                !oldSkills.some(
                    oldSkill =>
                        oldSkill.skill
                            .toLowerCase() ===
                        newSkill.skill
                            .toLowerCase()
                )
        );


    const removedSkills =
        oldSkills.filter(
            oldSkill =>
                !newSkills.some(
                    newSkill =>
                        newSkill.skill
                            .toLowerCase() ===
                        oldSkill.skill
                            .toLowerCase()
                )
        );


    const updatedSkills =
        newSkills.filter(
            newSkill => {

                const oldSkill =
                    oldSkills.find(
                        oldSkill =>
                            oldSkill.skill
                                .toLowerCase() ===
                            newSkill.skill
                                .toLowerCase()
                    );


                return (
                    oldSkill &&
                    Number(
                        oldSkill.rating
                    ) !==
                    Number(
                        newSkill.rating
                    )
                );

            }
        );


    let changeLines = "";


    if (addedSkills.length > 0) {

        changeLines += `

            <p>
                <strong>Added:</strong>
                ${addedSkills
                    .map(
                        item =>
                            `${escapeHtml(item.skill)}
                             (${item.rating}/5)`
                    )
                    .join(", ")}
            </p>

        `;

    }


    if (removedSkills.length > 0) {

        changeLines += `

            <p>
                <strong>Removed:</strong>
                ${removedSkills
                    .map(
                        item =>
                            `${escapeHtml(item.skill)}
                             (${item.rating}/5)`
                    )
                    .join(", ")}
            </p>

        `;

    }


    if (updatedSkills.length > 0) {

        changeLines += `

            <p>
                <strong>Updated:</strong>
                ${updatedSkills
                    .map(
                        item => {

                            const oldSkill =
                                oldSkills.find(
                                    oldItem =>
                                        oldItem.skill
                                            .toLowerCase() ===
                                        item.skill
                                            .toLowerCase()
                                );

                            return `
                                ${escapeHtml(item.skill)}
                                (${oldSkill.rating}/5
                                → ${item.rating}/5)
                            `;

                        }
                    )
                    .join(", ")}
            </p>

        `;

    }


    await notifyAdministrators({

        senderEmail:
            req.user.email,

        subject:
            `Employee Skills Updated - ${employee.name}`,

        html: `

            <div
                style="
                    font-family: Arial, sans-serif;
                "
            >

                <h2>
                    Employee Skills Updated
                </h2>

                <p>

                    <strong>
                        ${escapeHtml(
                            req.user.name
                        )}
                    </strong>

                    updated the skills of

                    <strong>
                        ${escapeHtml(
                            employee.name
                        )}
                    </strong>.

                </p>


                <p>

                    <strong>
                        Employee ID:
                    </strong>

                    ${escapeHtml(
                        employee.empId
                    )}

                </p>


                ${changeLines}

            </div>

        `,

    });

}
        const updatedEmployee = await Employee.findById(employee._id)

            .populate("reportingManager", "name")

            .populate("assignments.client", "name logo")

            .populate("assignments.project", "name");

        res.status(200).json({

            success: true,

            message: "Employee updated successfully",

            data: updatedEmployee,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

/*
==========================================
Delete Employee
==========================================
*/

const deleteEmployee = async (req, res) => {

    try {

        const employee = await Employee.findByIdAndDelete(

            req.params.id

        );

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

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

/*
==========================================
Search Employees
==========================================
*/

const searchEmployees = async (req, res) => {

    try {

        const q = req.query.q || "";

        let employees = await Employee.find({

            $or: [

                {

                    name: {

                        $regex: q,

                        $options: "i",

                    },

                },

                {

                    empId: {

                        $regex: q,

                        $options: "i",

                    },

                },

                {

                    email: {

                        $regex: q,

                        $options: "i",

                    },

                },

                {

                    "skills.skill": {

                        $regex: q,

                        $options: "i",

                    },

                },

            ],

        })

            .populate("reportingManager", "name")

            .populate("assignments.client", "name logo")

            .populate("assignments.project", "name");

        employees = employees.map(enrichEmployee);

        res.status(200).json({

            success: true,

            count: employees.length,

            data: employees,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

/*
==========================================
Get Employees By Skills
==========================================
*/

const getEmployeesBySkills = async (req, res) => {

    try {

        const skillIds = req.query.skills

            ? req.query.skills.split(",")

            : [];

        if (skillIds.length === 0) {

            const employees = await Employee.find(

                {},

                "name empId position experience skills location"

            );

            return res.status(200).json({

                success: true,

                data: employees,

            });

        }

        const skills = await Skill.find({

            _id: {

                $in: skillIds,

            },

        });

        const skillNames = skills.map(

            skill => skill.name

        );

        const employees = await Employee.find(

            {},

            "name empId position experience skills location"

        );

        const filteredEmployees = employees.filter(

            employee => {

                const employeeSkills = employee.skills.map(

                    item => item.skill

                );

                return employeeSkills.some(

                    skill =>

                        skillNames.includes(skill)

                );

            }

        );

        res.status(200).json({

            success: true,

            data: filteredEmployees,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

module.exports = {

    getEmployees,
    
    getEmployeeById,
    getMyEmployee,
    createEmployee,

    updateEmployee,

    deleteEmployee,

    searchEmployees,

    getEmployeesBySkills,

};