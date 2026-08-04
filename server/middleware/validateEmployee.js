const validateEmployee = (req, res, next) => {

    const {

        empId,
        name,
        email,
        assignments = [],

    } = req.body;

    if (!empId)

        return res.status(400).json({

            success: false,

            message: "Employee ID is required",

        });

    if (!name)

        return res.status(400).json({

            success: false,

            message: "Employee Name is required",

        });

    if (!email)

        return res.status(400).json({

            success: false,

            message: "Email is required",

        });

    // Validate all assignments

    for (const assignment of assignments) {

        if (

            assignment.startDate &&

            assignment.endDate &&

            new Date(assignment.endDate) <

                new Date(assignment.startDate)

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Assignment End Date cannot be before Start Date.",

            });

        }

        if (

            assignment.allocation !== undefined &&

            (assignment.allocation < 1 ||

                assignment.allocation > 100)

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Allocation must be between 1 and 100.",

            });

        }

    }

    next();

};

module.exports = validateEmployee;