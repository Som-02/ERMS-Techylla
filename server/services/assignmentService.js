const Employee = require("../models/Employee");
const Project = require("../models/Project");

const assignEmployeeToProject = async ({
    employeeId,
    projectId,
    role,
    location,
    startDate,
    endDate,
    allocation,
}) => {
    const project = await Project.findById(projectId)
    .populate("client")
    .populate("requiredSkills.skill");

        if (!project) {

            throw new Error("Project not found");

        }

        const employee = await Employee.findById(employeeId);

        if (!employee) {

            throw new Error("Employee not found");

        }

if (employee.location !== location) {

    throw new Error("Employee's location is mismatched");

}
// ==========================================
// RESOURCE VALIDATION
// ==========================================

const hasSkill = employee.skills.some(

    skill => skill.skill === role

);

if (!hasSkill) {

    throw new Error("Employee doesn't have the required role.");

}
const alreadyAssigned = employee.assignments.some(

    assignment =>

        assignment.project.toString() === projectId &&

        assignment.role?.name === role

);

if (alreadyAssigned) {

    throw new Error("Employee already assigned");

}
const requiredRole = project.requiredSkills.find(

    item => item.skill.name === role

);

if (!requiredRole) {

    throw new Error("Role not found in this project.");

}
const assignedEmployees = await Employee.find({

    "assignments.project": project._id,

});

const locationMap = {
    "Onshore / US": "onshore",
    "Offshore / INDIA": "offshore",
};

const locationKey = locationMap[location];

let currentCount = 0;

for (const emp of assignedEmployees) {

    const assigned = emp.assignments.find(

        assignment =>

            assignment.project.toString() === projectId &&

            assignment.role?.name === role &&

            assignment.location === location

    );

    if (assigned)

        currentCount++;

}

const requiredCount =

    requiredRole.resources[locationKey];

if (currentCount >= requiredCount) {

   throw new Error("No more resources required");

}
        employee.assignments.push({

    client: project.client._id,

    project: project._id,

    role: {

        skillId: requiredRole.skill._id,

        name: role,

    },

    location,

    startDate,

    endDate,

    allocation,

});

        await employee.save();
// -----------------------------
// Update Project
// -----------------------------

if (

    !project.assignedEmployees.some(

        id => id.toString() === employee._id.toString()

    )

) {

    project.assignedEmployees.push(employee._id);

    await project.save();
}
};
module.exports = {
    assignEmployeeToProject,
};