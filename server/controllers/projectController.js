const Project = require("../models/Project");
const Employee = require("../models/Employee");
const Client = require("../models/Client");
const {
    assignEmployeeToProject,
} = require("../services/assignmentService");
// ============================
// Get All Projects
// ============================

const getProjects = async (req, res) => {

    try {

        const filter = {};


if(req.query.status){

    filter.status=req.query.status;

}


if(req.query.name){

    filter.name={
        $regex:req.query.name,
        $options:"i"
    };

}
if(req.query.client){

    const clients = await Client.find({

        name:{
            $regex:req.query.client,
            $options:"i"
        }

    });


    filter.client = {
        $in: clients.map(
            client => client._id
        )
    };

}
if(req.query.date){

const raw =
req.query.date
.toLowerCase()
.trim()
.replace(/,/g,"")
.replace(
 /(st|nd|rd|th)/g,
 ""
);


// ---------------------
// MONTH MAP
// ---------------------

const months = {

jan:0,
january:0,

feb:1,
february:1,

mar:2,
march:2,

apr:3,
april:3,

may:4,

jun:5,
june:5,

jul:6,
july:6,

aug:7,
august:7,

sep:8,
sept:8,
september:8,

oct:9,
october:9,

nov:10,
november:10,

dec:11,
december:11

};


// ---------------------
// WEEK DAYS
// ---------------------

const weekdays = {

sun:0,
sunday:0,

mon:1,
monday:1,

tue:2,
tues:2,
tuesday:2,

wed:3,
wednesday:3,

thu:4,
thur:4,
thursday:4,

fri:5,
friday:5,

sat:6,
saturday:6

};


// ---------------------
// EXTRACT YEAR
// ---------------------

const yearMatch =
raw.match(/\b(20\d{2})\b/);


const year =
yearMatch
?
Number(yearMatch[0])
:
null;



// ---------------------
// EXTRACT MONTH
// ---------------------

let month=null;


for(const key in months){

if(raw.includes(key)){

month=months[key];

break;

}

}



// ---------------------
// EXTRACT DAY NUMBER
// ---------------------

const numbers =
raw.match(/\b\d{1,2}\b/g);


let day=null;


if(numbers){

for(const num of numbers){

const n=Number(num);

if(n>=1 && n<=31 && n!==year){

day=n;

break;

}

}

}



// ---------------------
// EXTRACT WEEKDAY
// ---------------------

let weekday=null;


for(const key in weekdays){

if(raw.includes(key)){

weekday=weekdays[key];

break;

}

}



const conditions=[];



// ---------------------
// EXACT DATE
// ---------------------

if(day && month!==null && year){


const start =
new Date(year,month,day);


const end =
new Date(year,month,day);


end.setHours(
23,59,59,999
);



conditions.push({

startDate:{
$gte:start,
$lte:end
}

});


conditions.push({

endDate:{
$gte:start,
$lte:end
}

});


}



// ---------------------
// YEAR + MONTH
// ---------------------

else if(month!==null && year){


conditions.push({

startDate:{
$gte:new Date(year,month,1),
$lt:new Date(year,month+1,1)
}

});


}



// ---------------------
// MONTH ONLY
// ---------------------

else if(month!==null){


const currentYear =
new Date().getFullYear();


conditions.push({

$expr:{
$eq:[
{
$month:"$startDate"
},
month+1
]
}

});


conditions.push({

$expr:{
$eq:[
{
$month:"$endDate"
},
month+1
]
}

});


}



// ---------------------
// DAY ONLY
// ---------------------

else if(day){


conditions.push({

$expr:{
$eq:[
{
$dayOfMonth:"$startDate"
},
day
]
}

});


conditions.push({

$expr:{
$eq:[
{
$dayOfMonth:"$endDate"
},
day
]
}

});


}



// ---------------------
// WEEKDAY
// ---------------------

else if(weekday!==null){


conditions.push({

$expr:{
$eq:[
{
$dayOfWeek:"$startDate"
},
weekday+1
]
}

});


conditions.push({

$expr:{
$eq:[
{
$dayOfWeek:"$endDate"
},
weekday+1
]
}

});


}



if(conditions.length){

filter.$or=conditions;

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