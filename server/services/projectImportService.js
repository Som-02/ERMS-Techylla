const Employee = require("../models/Employee");
const Project = require("../models/Project");
const Client = require("../models/Client");

/*
==========================================
HELPER
==========================================
*/

const parseDate = (date) => {

    console.log("parseDate input:", JSON.stringify(date));

    if (!date) return null;

    const value = String(date).trim();

    console.log("after trim:", value);

    const parsed = new Date(value);

    console.log("parsed:", parsed);

    return parsed;
};

const {

    parseEmployees

} = require("../utils/employeeParser");
const {
    validateEmployeeAllocation,
} = require("./allocationService");
/*
==========================================
DETECT CHANGES
==========================================
*/

const detectChanges = async (

    project,

    excelEmployees

) => {

    const dbEmployees = await Employee.find({

        "assignments.project": project._id,

    }).lean();

    const changes = {

        added: [],

        removed: [],

        updated: [],

        unchanged: [],

    };

    /*
    ----------------------------
    Existing Employees
    ----------------------------
    */

    dbEmployees.forEach(dbEmployee => {

        const assignment = dbEmployee.assignments.find(

            assignment =>

                assignment.project.toString() ===

                project._id.toString()

        );

        const excelEmployee = excelEmployees.find(

            employee =>

                employee.empId === dbEmployee.empId

        );

        if (!excelEmployee) {

            changes.removed.push({

                empId: dbEmployee.empId,

                name: dbEmployee.name,

            });

            return;

        }

        const dbStart = assignment.startDate

            ? new Date(assignment.startDate).toDateString()

            : "";

        const dbEnd = assignment.endDate

            ? new Date(assignment.endDate).toDateString()

            : "";

        const excelStart = parseDate(

            excelEmployee.startDate

        )?.toDateString();

        const excelEnd = parseDate(

            excelEmployee.endDate

        )?.toDateString();

        if (

            assignment.allocation !==

                excelEmployee.allocation ||

            dbStart !== excelStart ||

            dbEnd !== excelEnd

        ) {

            changes.updated.push({

                empId: dbEmployee.empId,

                name: dbEmployee.name,

                before: assignment,

                after: excelEmployee,

            });

        }

        else {

            changes.unchanged.push({

                empId: dbEmployee.empId,

                name: dbEmployee.name,

            });

        }

    });

    /*
    ----------------------------
    Newly Added Employees
    ----------------------------
    */

    excelEmployees.forEach(employee => {

        const exists = dbEmployees.find(

            dbEmployee =>

                dbEmployee.empId ===

                employee.empId

        );

        if (!exists) {

            changes.added.push(employee);

        }

    });

    return {

        dbEmployees,

        changes,

    };

};
/*
==========================================
VALIDATE IMPORT
==========================================
*/

const validateProjectImport = async (
    excelRows
) => {

    const errors = [];

    const preview = [];

    const duplicateAssignments = new Set();

    for (

        let rowIndex = 0;

        rowIndex < excelRows.length;

        rowIndex++

    ) {

        const row = excelRows[rowIndex];

        /*
        ==========================
        PROJECT
        ==========================
        */

        const project = await Project.findOne({

            name: row.project,

        })

            .populate("client")

            .populate("requiredSkills", "name").lean();

        if (!project) {

            errors.push({

                row: rowIndex + 3,

                field: "Project",

                message:

                    `Project "${row.project}" not found.`,

            });

            continue;

        }

        /*
        ==========================
        CLIENT
        ==========================
        */

        const client = await Client.findOne({

            name: row.client,

        }).lean();

        if (!client) {

            errors.push({

                row: rowIndex + 3,

                field: "Client",

                message:

                    `Client "${row.client}" not found.`,

            });

            continue;

        }

        if (

            project.client._id.toString() !==

            client._id.toString()

        ) {

            errors.push({

                row: rowIndex + 3,

                field: "Client",

                message:

                    `Project "${row.project}" doesn't belong to "${row.client}".`

            });

        }

        /*
==========================
PROJECT DATE
==========================
*/

const projectStart = parseDate(row.projectStart);

const projectEnd = parseDate(row.projectEnd);

/*
Allowed:
✔ Start + End
✔ Start only
✔ End only
✔ No dates

Only compare when BOTH dates exist.
*/

if (

    projectStart &&

    projectEnd &&

    projectEnd < projectStart

) {

    errors.push({

        row: rowIndex + 3,

        field: "Project Dates",

        message:
            "Project End Date cannot be before Project Start Date.",

    });

}

        /*
        ==========================
        EMPLOYEE PARSE
        ==========================
        */

        const parsedEmployees = parseEmployees(

            row.employeeDetails

        );

        /*
        ==========================
        CHANGE DETECTION
        ==========================
        */

        const comparison = await detectChanges(

            project,

            parsedEmployees

        );

        /*
        ==========================
        VALIDATE EMPLOYEES
        ==========================
        */

        for (

            const employee of parsedEmployees

        ) {

            const duplicateKey =

                `${project._id}-${employee.empId}`;

            if (

                duplicateAssignments.has(

                    duplicateKey

                )

            ) {

                errors.push({

                    row: rowIndex + 3,

                    field: "Employee",

                    message:

                        `${employee.empId} appears multiple times in this project.`,

                });

                continue;

            }

            duplicateAssignments.add(

                duplicateKey

            );

            /*
            --------------------
            Employee Exists
            --------------------
            */

            const empId = employee.empId.trim();

const existingEmployee = await Employee.findOne({
    empId: {
        $regex: `^${empId}$`,
        $options: "i",
    },
});

            if (!existingEmployee) {

                errors.push({

                    row: rowIndex + 3,

                    field: "Employee",

                    message:

                        `${employee.empId} not found.`,

                });

                continue;

            }
                        /*
            --------------------
            Required Skills
            --------------------
            */

            const employeeSkills =

(existingEmployee.skills || []).map(

    skill =>

    (skill.skill || "").trim().toLowerCase()

);

const requiredSkills = (project.requiredSkills || []).map(
    skill => (skill.name || "").trim().toLowerCase()
);

            const hasAllSkills = requiredSkills.every(

                skill => employeeSkills.includes(skill)

            );

            if (!hasAllSkills) {

                errors.push({

                    row: rowIndex + 3,

                    field: "Skills",

                    message:

                        `${employee.empId} doesn't satisfy project skills.`,

                });

            }
const allocation = await validateEmployeeAllocation(

    employee.empId,

    employee.allocation,

    project._id

);

if (!allocation.valid) {

    errors.push({

        row: rowIndex + 3,

        field: "Allocation",

        message: allocation.message,

    });

}
/*
--------------------
Assignment Dates
--------------------
*/

const employeeStart = parseDate(employee.startDate);

const employeeEnd = parseDate(employee.endDate);

/*
Allowed:
✔ Start + End
✔ Start only
✔ End only
✔ No dates

Only compare when BOTH dates exist.
*/

if (

    employeeStart &&

    employeeEnd &&

    employeeEnd < employeeStart

) {

    errors.push({

        row: rowIndex + 3,

        field: "Assignment",

        message:
            `${employee.empId} has End Date before Start Date.`,

    });

}

        }

        /*
        ==========================
        Preview
        ==========================
        */

        preview.push({

            ...row,

            employees: parsedEmployees,

            changes: comparison.changes,

        });

    }

    /*
    ==========================
    Summary
    ==========================
    */

    const summary = {

        rows: excelRows.length,

        projects: preview.length,

        employees: preview.reduce(

            (sum, project) =>

                sum +

                project.employees.length,

            0

        ),

        added: preview.reduce(

            (sum, project) =>

                sum +

                project.changes.added.length,

            0

        ),

        removed: preview.reduce(

            (sum, project) =>

                sum +

                project.changes.removed.length,

            0

        ),

        updated: preview.reduce(

            (sum, project) =>

                sum +

                project.changes.updated.length,

            0

        ),

    };

    return {

        success: errors.length === 0,

        summary,

        errors,

        preview,

    };

};

module.exports = {

    validateProjectImport,

};