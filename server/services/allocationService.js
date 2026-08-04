const Employee = require("../models/Employee");

/*
==========================================
CURRENT ALLOCATION
==========================================
*/

const getEmployeeAllocation = (

    employee,

    ignoreProjectId = null

) => {

    let total = 0;

    employee.assignments.forEach(assignment => {

        if (

            ignoreProjectId &&

            assignment.project.toString() ===

            ignoreProjectId.toString()

        ) {

            return;

        }

        total += assignment.allocation || 0;

    });

    return total;

};

/*
==========================================
VALIDATE
==========================================
*/

const validateEmployeeAllocation = async (

    empId,

    allocation,

    projectId = null

) => {

    const employee = await Employee.findOne({

        empId,

    });

    if (!employee) {

        return {

            valid: false,

            message: "Employee not found.",

        };

    }

    const current = getEmployeeAllocation(

        employee,

        projectId

    );

    if (

        current + allocation >

        100

    ) {

        return {

            valid: false,

            message:

                `Allocation exceeds 100% (${current + allocation}%).`,

        };

    }

    return {

        valid: true,

        current,

        remaining:

            100 -

            (current + allocation),

    };

};

module.exports = {

    getEmployeeAllocation,

    validateEmployeeAllocation,

};