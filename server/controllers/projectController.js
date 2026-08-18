const Project = require("../models/Project");
const Employee = require("../models/Employee");
const Client = require("../models/Client");
const {
    assignEmployeeToProject,
} = require("../services/assignmentService");
// ============================
// Get All Projects
// ============================
const MONTHS = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
};

const MONTH_ALIASES = {
    jan: "january",
    feb: "february",
    mar: "march",
    apr: "april",
    jun: "june",
    jul: "july",
    aug: "august",
    sep: "september",
    sept: "september",
    oct: "october",
    nov: "november",
    dec: "december",
};

const DAYS = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

const DAY_ALIASES = {
    sun: "sunday",
    mon: "monday",
    tue: "tuesday",
    tues: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    thur: "thursday",
    thurs: "thursday",
    fri: "friday",
    sat: "saturday",
};
const buildDateFilter = (value, field) => {

    if (!value || typeof value !== "string") {
        return null;
    }

    let text = value
        .trim()
        .toLowerCase()
        .replace(/,/g, " ")
        .replace(/\s+/g, " ");

    if (!text) {
        return null;
    }

    // Remove ordinal suffixes
    // 12th -> 12
    // 1st -> 1
    // 2nd -> 2
    // 3rd -> 3
    text = text.replace(
        /\b(\d{1,2})(st|nd|rd|th)\b/g,
        "$1"
    );

    const now = new Date();
    const currentYear = now.getFullYear();

    // =====================================================
    // 1. NORMAL NUMERIC DATE
    // 12/08/2026
    // 12-08-2026
    // 12/08
    // =====================================================

    const numericDate = text.match(
        /^(\d{1,4})[\/\-](\d{1,2})[\/\-](\d{1,4})$/
    );

    if (numericDate) {

        let first = Number(numericDate[1]);
        let second = Number(numericDate[2]);
        let third = Number(numericDate[3]);

        let day;
        let month;
        let year;

        // YYYY-MM-DD
        if (String(numericDate[1]).length === 4) {

            year = first;
            month = second - 1;
            day = third;

        }

        // DD-MM-YYYY
        else {

            day = first;
            month = second - 1;
            year = third;

        }

        const start = new Date(
            year,
            month,
            day,
            0,
            0,
            0,
            0
        );

        const end = new Date(
            year,
            month,
            day,
            23,
            59,
            59,
            999
        );

        return {
            [field]: {
                $gte: start,
                $lte: end
            }
        };

    }


    // =====================================================
    // 2. MONTHS
    // =====================================================

    const months = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11
    };

    const monthAliases = {
        jan: "january",
        feb: "february",
        mar: "march",
        apr: "april",
        jun: "june",
        jul: "july",
        aug: "august",
        sep: "september",
        sept: "september",
        oct: "october",
        nov: "november",
        dec: "december"
    };

    let normalizedText = text;

    Object.keys(monthAliases).forEach(alias => {

        const fullName = monthAliases[alias];

        const regex = new RegExp(
            `\\b${alias}\\b`,
            "i"
        );

        normalizedText =
            normalizedText.replace(
                regex,
                fullName
            );

    });

    let monthIndex = null;

    for (const monthName in months) {

        if (
            new RegExp(
                `\\b${monthName}\\b`,
                "i"
            ).test(normalizedText)
        ) {

            monthIndex = months[monthName];

            break;

        }

    }


    // =====================================================
    // 3. YEAR
    // =====================================================

    const yearMatch = text.match(
        /\b(19|20)\d{2}\b/
    );

    const year = yearMatch
        ? Number(yearMatch[0])
        : null;


    // =====================================================
    // 4. DAY NUMBER
    // =====================================================

    const dayMatch = text.match(
        /\b([1-9]|[12]\d|3[01])\b/
    );

    const dayNumber = dayMatch
        ? Number(dayMatch[1])
        : null;


    // =====================================================
    // 5. DAY + MONTH
    //
    // 12 August
    // August 12
    // 12 Aug
    // Aug 12
    // =====================================================

    if (
        dayNumber &&
        monthIndex !== null
    ) {

        const targetYear =
            year || currentYear;

        const start = new Date(
            targetYear,
            monthIndex,
            dayNumber,
            0,
            0,
            0,
            0
        );

        const end = new Date(
            targetYear,
            monthIndex,
            dayNumber,
            23,
            59,
            59,
            999
        );

        return {
            [field]: {
                $gte: start,
                $lte: end
            }
        };

    }


    // =====================================================
    // 6. MONTH + YEAR
    //
    // August 2026
    // Aug 2026
    // =====================================================

    if (
        monthIndex !== null &&
        year
    ) {

        const start = new Date(
            year,
            monthIndex,
            1,
            0,
            0,
            0,
            0
        );

        const end = new Date(
            year,
            monthIndex + 1,
            0,
            23,
            59,
            59,
            999
        );

        return {
            [field]: {
                $gte: start,
                $lte: end
            }
        };

    }


    // =====================================================
    // 7. MONTH ONLY
    //
    // August
    // august
    // Aug
    // =====================================================

    if (monthIndex !== null) {

        return {
            $expr: {
                $eq: [
                    {
                        $month: `$${field}`
                    },
                    monthIndex + 1
                ]
            }
        };

    }


    // =====================================================
    // 8. YEAR ONLY
    //
    // 2026
    // =====================================================

    if (year) {

        return {
            $expr: {
                $eq: [
                    {
                        $year: `$${field}`
                    },
                    year
                ]
            }
        };

    }


    // =====================================================
    // 9. DAY OF MONTH ONLY
    //
    // 12
    // 12th
    // =====================================================

    if (
        dayNumber &&
        !monthIndex &&
        !year
    ) {

        return {
            $expr: {
                $eq: [
                    {
                        $dayOfMonth: `$${field}`
                    },
                    dayNumber
                ]
            }
        };

    }


    // =====================================================
    // 10. DAY OF WEEK
    //
    // Monday
    // monday
    // Mon
    // =====================================================

    const days = {
        sunday: 1,
        monday: 2,
        tuesday: 3,
        wednesday: 4,
        thursday: 5,
        friday: 6,
        saturday: 7
    };

    const dayAliases = {
        sun: "sunday",
        mon: "monday",
        tue: "tuesday",
        tues: "tuesday",
        wed: "wednesday",
        thu: "thursday",
        thur: "thursday",
        thurs: "thursday",
        fri: "friday",
        sat: "saturday"
    };

    let dayName = null;

    for (const day in days) {

        if (
            new RegExp(
                `\\b${day}\\b`,
                "i"
            ).test(text)
        ) {

            dayName = day;
            break;

        }

    }

    if (!dayName) {

        for (const alias in dayAliases) {

            if (
                new RegExp(
                    `\\b${alias}\\b`,
                    "i"
                ).test(text)
            ) {

                dayName =
                    dayAliases[alias];

                break;

            }

        }

    }

    if (dayName) {

        return {
            $expr: {
                $eq: [
                    {
                        $dayOfWeek: `$${field}`
                    },
                    days[dayName]
                ]
            }
        };

    }

    return null;

};
const getProjects = async (req, res) => {

    try {

        const filter = {};


// ============================
// Project Name Filter
// ============================

if (req.query.name) {

    filter.name = {
        $regex: req.query.name,
        $options: "i"
    };

}


// ============================
// Client Filter
// ============================

if (req.query.client) {

    const clients = await Client.find({

        name: {
            $regex: req.query.client,
            $options: "i"
        }

    }).select("_id");

    filter.client = {
        $in: clients.map(client => client._id)
    };

}


// ============================
// Status Filter
// ============================

let statuses = [];

// ------------------------------------
// Normal query:
// ?status=Active
// ?status=Active&status=Pipeline
// ------------------------------------

if (req.query.status) {

    if (Array.isArray(req.query.status)) {

        statuses.push(...req.query.status);

    } else {

        statuses.push(req.query.status);

    }

}


// ------------------------------------
// Axios may send:
// ?status[]=Active&status[]=Pipeline
// ------------------------------------

if (req.query["status[]"]) {

    if (Array.isArray(req.query["status[]"])) {

        statuses.push(...req.query["status[]"]);

    } else {

        statuses.push(req.query["status[]"]);

    }

}


// ------------------------------------
// Clean values
// ------------------------------------

statuses = statuses
    .flat()
    .filter(Boolean)
    .map(status => String(status).trim())
    .filter(Boolean);


// ------------------------------------
// Remove duplicates
// ------------------------------------

statuses = [...new Set(statuses)];


// ------------------------------------
// Apply filter
// ------------------------------------

if (statuses.length > 0) {

    filter.status = {

        $in: statuses

    };

}


// ============================
// Start Date Filter
// ============================

if (req.query.startDate) {

    const dateFilter =
        buildDateFilter(
            req.query.startDate,
            "startDate"
        );

    if (dateFilter) {

        Object.assign(
            filter,
            dateFilter
        );

    }

}


// ============================
// End Date Filter
// ============================

if (req.query.endDate) {

    const dateFilter =
        buildDateFilter(
            req.query.endDate,
            "endDate"
        );

    if (dateFilter) {

        Object.assign(
            filter,
            dateFilter
        );

    }

}


        const projects = await Project.find(filter)
            .populate("client")
            .populate("requiredSkills", "name")
            .sort({ name: 1 });

        res.status(200).json({

            success: true,

            data: projects,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ============================
// Get Project By ID
// ============================

const getProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id)
    .populate("client")
    .populate("requiredSkills.skill");

        if (!project) {

            return res.status(404).json({

                success: false,

                message: "Project not found",

            });

        }

        const employees = await Employee.find({

            "assignments.project": project._id,

        });

        const employeeList = employees.map((employee) => {

            const assignment = employee.assignments.find(

                (assignment) =>

                    assignment.project.toString() ===

                    project._id.toString() &&
                    assignment.role?.name === employee.role

            );

            return {

    _id: employee._id,

    empId: employee.empId,

    name: employee.name,

    position: employee.position,

    experience: employee.experience,

    location: employee.location,

    role: assignment?.role?.name || null,

    startDate: assignment?.startDate || null,

    endDate: assignment?.endDate || null,

    allocation: assignment?.allocation || 0,

};

        });
        res.status(200).json({

            success: true,

            data: {

                project,

                employees: employeeList,

            },

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
const getMyProjects = async(req,res)=>{

try{

const employeeId = req.user.id;


const employee = await Employee.findById(employeeId);


if(!employee){

return res.status(404).json({
message:"Employee not found"
});

}


// get project ids assigned to employee

const projectIds =
employee.assignments.map(
assignment=>assignment.project
);


const projects = await Project.find({

_id:{
    $in:projectIds
}

})
.populate("client")
.sort({
name:1
});


res.status(200).json({

success:true,
data:projects

});


}
catch(error){

res.status(500).json({

success:false,
message:error.message

});

}

};
// ============================
// Get Project Staffing Plan
// ============================

const getProjectStaffingPlan = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id)

            .populate("client")

            .populate("requiredSkills.skill");

        if (!project) {

            return res.status(404).json({

                success: false,

                message: "Project not found",

            });

        }

        const assignedEmployees = await Employee.find({

            "assignments.project": project._id,

        });

        const staffingPlan = [];

        // Generate all required slots

        for (const role of project.requiredSkills) {

            // ---------- ONSHORE ----------

            for (

                let i = 0;

                i < (role.resources?.onshore || 0);

                i++

            ) {

                staffingPlan.push({

                    role: role.skill.name,

                    location: "Onshore / US",

                    employee: null,

                });

            }

            // ---------- OFFSHORE ----------

            for (

                let i = 0;

                i < (role.resources?.offshore || 0);

                i++

            ) {

                staffingPlan.push({

                    role: role.skill.name,

                    location: "Offshore / INDIA",

                    employee: null,

                });

            }

        }

        // Fill slots with assigned employees

        // Fill slots with assigned employees

for (const employee of assignedEmployees) {

    for (const assignment of employee.assignments) {

        if (

            assignment.project.toString() !==

            project._id.toString()

        ) {

            continue;

        }

        const slot = staffingPlan.find(

            item =>

                !item.employee &&

                item.role === assignment.role?.name &&

                item.location === assignment.location

        );

        if (!slot) continue;

        slot.employee = {

            _id: employee._id,

            empId: employee.empId,

            name: employee.name,

            position: employee.position,

            experience: employee.experience,

            location: employee.location,

            startDate: assignment.startDate,

            endDate: assignment.endDate,

            allocation: assignment.allocation,

        };

    }

}

        res.status(200).json({

            success: true,

            data: {

                project,

                staffingPlan,

            },

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// ============================
// Create Project
// ============================

const createProject = async (req, res) => {

    try {

        if (

            req.body.startDate &&

            req.body.endDate &&

            new Date(req.body.endDate) <

                new Date(req.body.startDate)

        ) {

            return res.status(400).json({

                success: false,

                message:

                    "Project End Date cannot be before Start Date.",

            });

        }

        const {

    assignedEmployees,

    ...projectData

} = req.body;

const project = await Project.create({

    ...projectData,

    requiredSkills:
        projectData.requiredSkills.map(role=>({

            ...role,

            roleCreatedAt:new Date()

        })),

    statusChangedAt:new Date()

});

        if (

            assignedEmployees &&

            assignedEmployees.length > 0

        ) {

            for (const employeeId of assignedEmployees) {

                const employee = await Employee.findById(employeeId);

                if (!employee) continue;

                const alreadyAssigned = employee.assignments.some(

                    (assignment) =>

                        assignment.project.toString() ===

                        project._id.toString()

                );

                if (alreadyAssigned) {

                    continue;

                }

                employee.assignments.push({

                    client: project.client,

                    project: project._id,

                    startDate: project.startDate,

                    endDate: project.endDate,

                    allocation: 100,

                });

                await employee.save();

            }

        }

        res.status(201).json({

            success: true,

            message: "Project Created Successfully",

            data: project,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ============================
// Update Project
// ============================

const updateProject = async (req, res) => {

    try {

        if (
            req.body.startDate &&
            req.body.endDate &&
            new Date(req.body.endDate) <
                new Date(req.body.startDate)
        ) {

            return res.status(400).json({

                success:false,

                message:"Project End Date cannot be before Start Date."

            });

        }
const existingProject = await Project.findById(req.params.id);

if (!existingProject) {

    return res.status(404).json({

        success: false,

        message: "Project not found"

    });

}
        const {

            assignedEmployees=[],

            ...projectData

        } = req.body;
if (
    projectData.status &&
    projectData.status !== existingProject.status
) {

    projectData.statusChangedAt = new Date();

}
const oldRoles =
    existingProject.requiredSkills;


projectData.requiredSkills =
projectData.requiredSkills.map(newRole=>{


    const oldRole =
        oldRoles.find(
            old =>
            old.skill.toString() ===
            newRole.skill.toString()
        );


    return {

        ...newRole,

        roleCreatedAt:
    newRole.roleCreatedAt
    ?
    new Date(newRole.roleCreatedAt)
    :
    (
        oldRole?.roleCreatedAt
        ?
        oldRole.roleCreatedAt
        :
        new Date()
    )

    };


});
        // projectData.assignedEmployees = assignedEmployees;

        const project = await Project.findByIdAndUpdate(

            req.params.id,

            projectData,

            {

                new:true,

                runValidators:true

            }

        );

        if(!project){

            return res.status(404).json({

                success:false,

                message:"Project not found"

            });

        }

        // =============================
        // Employees currently assigned
        // =============================

        const currentEmployees = await Employee.find({

            "assignments.project":project._id

        });

        // ===================================
        // Remove employees no longer assigned
        // ===================================

        for(const employee of currentEmployees){

            if(
                !assignedEmployees.includes(
                    employee._id.toString()
                )
            ){

                employee.assignments =
                    employee.assignments.filter(

                        assignment=>

                            assignment.project.toString() !==
                            project._id.toString()

                    );

                await employee.save();

            }

        }

        // ===================================
        // Add new / Update existing employees
        // ===================================

        for(const employeeId of assignedEmployees){

            const employee =
                await Employee.findById(employeeId);

            if(!employee) continue;

            const assignment =
                employee.assignments.find(

                    assignment=>

                        assignment.project.toString() ===
                        project._id.toString()

                );

            if(assignment){

                // Preserve allocation
                // Preserve custom dates if already changed

                assignment.client = project.client;

                if(
                    assignment.startDate?.getTime() ===
                    new Date(project.startDate).getTime()
                ){

                    assignment.startDate =
                        project.startDate;

                }

                if(
                    assignment.endDate?.getTime() ===
                    new Date(project.endDate).getTime()
                ){

                    assignment.endDate =
                        project.endDate;

                }

            }


            await employee.save();

        }

        res.status(200).json({

            success:true,

            message:"Project Updated Successfully",

            data:project

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// ============================
// Delete Project
// ============================

const deleteProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id);

        if (!project) {

            return res.status(404).json({

                success: false,

                message: "Project not found",

            });

        }

        // Remove this project from every employee

        await Employee.updateMany(

            {

                "assignments.project": project._id,

            },

            {

                $pull: {

                    assignments: {

                        project: project._id,

                    },

                },

            }

        );

        await Project.findByIdAndDelete(project._id);

        res.status(200).json({

            success: true,

            message: "Project Deleted Successfully",

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ============================
// Search Projects
// ============================

const searchProjects = async (req, res) => {

    try {

        const q = req.query.q || "";

        const projects = await Project.find({

            name: {

                $regex: q,

                $options: "i",

            },

        })

            .populate("client")

            .populate("requiredSkills", "name");

        res.status(200).json({

            success: true,

            count: projects.length,

            data: projects,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// ============================
// Export Projects
// ============================

const exportProjects = async (req, res) => {

    try {

        const projects = await Project.find()

            .populate("client")

            .populate("requiredSkills", "name")

            .populate("assignedEmployees", "name empId");

        const result = [];

        for (const project of projects) {

            const employees = await Employee.find({

                "assignments.project": project._id,

            });

            const employeeList = employees.map(employee => {

                const assignment = employee.assignments.find(

                    assignment =>

                        assignment.project.toString() ===

                        project._id.toString()

                );

                return {

                    empId: employee.empId,

                    name: employee.name,

                    position: employee.position,

                    experience: employee.experience,

                    startDate: assignment?.startDate,

                    endDate: assignment?.endDate,

                    allocation: assignment?.allocation,

                };

            });

            result.push({

                _id: project._id,

                name: project.name,

                client: project.client,

                startDate: project.startDate,

                endDate: project.endDate,

                status: project.status,

                requiredSkills: project.requiredSkills,

                employees: employeeList,

            });

        }

        res.status(200).json({

            success: true,

            data: result,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// ============================
// Update Employee Assignment
// ============================

const updateAssignment = async (req, res) => {

    try {

        const { projectId, employeeId } = req.params;

        const {

            startDate,

            endDate,

            allocation,

        } = req.body;
        const project =
    await Project.findById(projectId);


if(!project){

    return res.status(404).json({

        success:false,

        message:"Project not found"

    });

}



const assignmentStart =
    new Date(startDate);

const assignmentEnd =
    new Date(endDate);


const projectStart =
    new Date(project.startDate);

const projectEnd =
    new Date(project.endDate);



if(assignmentStart < projectStart){

    return res.status(400).json({

        success:false,

        message:
        "Assignment start date cannot be before project start date."

    });

}



if(assignmentEnd > projectEnd){

    return res.status(400).json({

        success:false,

        message:
        "Assignment end date cannot be after project end date."

    });

}



if(assignmentStart > assignmentEnd){

    return res.status(400).json({

        success:false,

        message:
        "Assignment start date cannot be after end date."

    });

}
        const employee = await Employee.findById(employeeId);

        if (!employee) {

            return res.status(404).json({

                success: false,

                message: "Employee not found",

            });

        }

        const assignment = employee.assignments.find(

    assignment =>

        assignment.project.toString() === projectId &&

        assignment.role?.name === req.body.role

);

        if (!assignment) {

            return res.status(404).json({

                success: false,

                message: "Assignment not found",

            });

        }

        assignment.startDate = startDate || null;

        assignment.endDate = endDate || null;

        assignment.allocation = allocation;
        
        await employee.save();

        res.status(200).json({

            success: true,

            message: "Assignment updated successfully",

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// ============================
// Remove Employee Assignment
// ============================

const deleteAssignment = async (req, res) => {

    try {

        const { projectId, employeeId, role } = req.params;

        const employee = await Employee.findById(employeeId);

        if (!employee) {

            return res.status(404).json({

                success: false,

                message: "Employee not found",

            });

        }

        employee.assignments =
    employee.assignments.filter(

        assignment =>

            !(

                assignment.project.toString() === projectId &&

                assignment.role?.name === decodeURIComponent(role)

            )

    );

        await employee.save();
const project = await Project.findById(projectId);

if (project) {

    const stillAssigned = employee.assignments.some(

    assignment =>

        assignment.project.toString() === projectId

);

if (!stillAssigned) {

    project.assignedEmployees =
        project.assignedEmployees.filter(

            id =>

                id.toString() !== employeeId

        );

}

    await project.save();

}
        res.status(200).json({

            success: true,

            message: "Employee removed from project.",

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// ============================
// Assign Employee To Project
// ============================

const assignEmployee = async (req, res) => {

    try {

        await assignEmployeeToProject({

            employeeId: req.body.employeeId,

            projectId: req.params.projectId,

            role: req.body.role,

            location: req.body.location,

            startDate: req.body.startDate,

            endDate: req.body.endDate,

            allocation: req.body.allocation,

        });

        res.status(200).json({

            success: true,

            message: "Employee Assigned Successfully",

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message,

        });

    }

};
module.exports = {

    getProjects,
    getMyProjects,
    getProject,
    getProjectStaffingPlan,
    exportProjects,
    searchProjects,

    createProject,

    updateProject,
    updateAssignment,
    deleteAssignment,
    deleteProject,
    assignEmployee,
};