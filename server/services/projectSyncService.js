const mongoose = require("mongoose");

const Project = require("../models/Project");
const Employee = require("../models/Employee");
const Skill = require("../models/Skill");

const { parseEmployees } = require("../utils/employeeParser");

const {
    validateEmployeeAllocation,
} = require("./allocationService");
const parseDate = (date) => {

    if (!date) return null;

    if (date instanceof Date) {
        return date;
    }

    if (typeof date === "number") {
        // Excel serial date
        return new Date(Math.round((date - 25569) * 86400 * 1000));
    }

    const parsed = new Date(String(date).trim());

    if (isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;

};
/*
===========================================
SYNC SINGLE PROJECT
===========================================
*/
const syncProject = async (

    row,

    session

) => {
    
    const project = await Project.findOne({

        name: row.project,

    })

        .populate("client")

        .populate("requiredSkills")

        .session(session);

    if (!project) {

        throw new Error(

            `${row.project} not found.`

        );

    }

    /*
    ------------------------------------
    Update Project
    ------------------------------------
    */

    if (row.projectStart) {

    project.startDate = parseDate(
        row.projectStart
    );

}

if (row.projectEnd) {

    project.endDate = parseDate(
        row.projectEnd
    );

}

    project.status = row.status;


    await project.save({

        session,

    });
const updatedProject = await Project.findById(project._id)
    .populate("requiredSkills");

    const excelEmployees = row.employees;
    
        /*
    ------------------------------------
    Employees currently assigned
    ------------------------------------
    */

    const dbEmployees = await Employee.find({

        "assignments.project": project._id,

    }).session(session);

    const dbMap = new Map();

    dbEmployees.forEach(employee => {

        dbMap.set(

            employee.empId,

            employee

        );

    });

    const excelMap = new Map();

    excelEmployees.forEach(employee => {

        excelMap.set(

            employee.empId,

            employee

        );

    });

    let added = 0;

    let removed = 0;

    let updated = 0;
        /*
    ===========================================
    UPDATE EXISTING EMPLOYEES
    ===========================================
    */

    for (

        const [empId, employee]

        of dbMap.entries()

    ) {
        const excelEmployee =

            excelMap.get(empId);

        /*
        -----------------------------------
        Removed Employee
        -----------------------------------
        */

        if (!excelEmployee) {

            employee.assignments =

                employee.assignments.filter(

                    assignment =>

                        assignment.project.toString() !==

                        project._id.toString()

                );

            await employee.save({

                session,

            });

            removed++;

            continue;

        }

        /*
        -----------------------------------
        Existing Assignment
        -----------------------------------
        */

        const assignment =

            employee.assignments.find(

                assignment =>

                    assignment.project.toString() ===

                    project._id.toString()

            );

        if (!assignment) continue;
                /*
        -----------------------------------
        Validate Allocation
        -----------------------------------
        */

        const allocationResult =

            await validateEmployeeAllocation(

                employee.empId,

                excelEmployee.allocation,

                project._id

            );

        if (!allocationResult.valid) {

            throw new Error(

                `${employee.empId} : ${allocationResult.message}`

            );

        }

        let changed = false;

        /*
        -----------------------------------
        Allocation
        -----------------------------------
        */

        if (

            assignment.allocation !==

            excelEmployee.allocation

        ) {

            assignment.allocation =

                excelEmployee.allocation;

            changed = true;

        }

        /*
-----------------------------------
Start Date
-----------------------------------
*/

const excelStart = parseDate(
    excelEmployee.startDate
);

if (

    excelStart &&

    assignment.startDate?.toDateString() !==
    excelStart.toDateString()

) {

    assignment.startDate = excelStart;

    changed = true;

}

/*
-----------------------------------
End Date
-----------------------------------
*/

const excelEnd = parseDate(
    excelEmployee.endDate
);

if (

    excelEnd &&

    assignment.endDate?.toDateString() !==
    excelEnd.toDateString()

) {

    assignment.endDate = excelEnd;

    changed = true;

}
if (changed) {

    await employee.save({

        session,

    });

    updated++;

}

    }

    /*
    ===========================================
    ADD NEW EMPLOYEES
    ===========================================
    */

    for (

        const [empId, excelEmployee]

        of excelMap.entries()

    ) {

        if (dbMap.has(empId))

            continue;

        const employee =

            await Employee.findOne({

                empId,

            }).session(session);

        if (!employee)

            continue;
                    /*
        -----------------------------------
        Validate Allocation
        -----------------------------------
        */

        const allocationResult =

            await validateEmployeeAllocation(

                employee.empId,

                excelEmployee.allocation

            );

        if (!allocationResult.valid) {

            throw new Error(

                `${employee.empId} : ${allocationResult.message}`

            );

        }

        const assignment = {

    client: project.client._id,

    project: project._id,

    allocation: excelEmployee.allocation,

};

const start = parseDate(
    excelEmployee.startDate
);

const end = parseDate(
    excelEmployee.endDate
);

if (start) {

    assignment.startDate = start;

}

if (end) {

    assignment.endDate = end;

}

employee.assignments.push(
    assignment
);

        await employee.save({

            session,

        });

        added++;

    }

    return {

        project: project.name,

        added,

        removed,

        updated,

    };

};
/*
===========================================
IMPORT PROJECTS
===========================================
*/

const importProjects = async (

    preview

) => {

    const session =

        await mongoose.startSession();

    try {

        let added = 0;

        let removed = 0;

        let updated = 0;

        const projects = [];

        await session.withTransaction(

            async () => {

                for (

                    const row of preview

                ) {

                    const result =

                        await syncProject(

                            row,

                            session

                        );

                    added += result.added;

                    removed += result.removed;

                    updated += result.updated;

                    projects.push(result);

                }

            }

        );

        session.endSession();

        return {

            success: true,

            summary: {

                importedProjects:

                    preview.length,

                employeesAdded:

                    added,

                employeesRemoved:

                    removed,

                employeesUpdated:

                    updated,

            },

            projects,

        };

    }

    catch (error) {

    console.error("REAL IMPORT ERROR:");
    console.error(error);

    session.endSession();

    throw error;

}

};

module.exports = {

    importProjects,

};