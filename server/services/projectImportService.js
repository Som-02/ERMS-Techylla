const Project = require("../models/Project");
const Client = require("../models/Client");

const parseDate = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    // Already a JS Date
    if (value instanceof Date) {
        return value;
    }

    // Excel serial number
    if (typeof value === "number") {

        return new Date(
            Math.round((value - 25569) * 86400 * 1000)
        );

    }

    const str = String(value).trim();

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {

        return new Date(str);

    }

    // DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {

        const [day, month, year] = str.split("-");

        return new Date(year, month - 1, day);

    }

    // DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {

        const [day, month, year] = str.split("/");

        return new Date(year, month - 1, day);

    }

    // Fallback
    const parsed = new Date(str);

    if (isNaN(parsed.getTime())) {

        return null;

    }

    return parsed;

};
const isSameDate = (a, b) => {

    if (!a && !b) return true;

    if (!a || !b) return false;

    return (
        new Date(a).toDateString() ===
        new Date(b).toDateString()
    );

};
const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date)
        .toISOString()
        .split("T")[0];

};
const VALID_STATUS = [

    "Active",
    "Completed",
    "On Hold",

];

const validateProjectImport = async (rows) => {

    const errors = [];

    const preview = [];

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];

        // ===========================
        // PROJECT VALIDATION
        // ===========================

        const project = await Project.findOne({

            name: row.project,

        });

        if (!project) {

            errors.push({

                row: i + 3,

                field: "Project",

                message: `Project "${row.project}" not found.`,

            });

            continue;

        }

const validationErrors = [];
        // ===========================
        // CLIENT VALIDATION
        // ===========================

        const client = await Client.findById(project.client);

        if (!client) {

            errors.push({

                row: i + 3,

                field: "Client",

                message: `Client for "${project.name}" not found.`,

            });

            continue;

        }

        if (row.client.trim() !== client.name.trim()) {

    validationErrors.push({

        field: "Client",

        entered: row.client,

        expected: client.name,

        message: `"${project.name}" belongs to "${client.name}", not "${row.client}".`

    });

}



        // ===========================
// DATE VALIDATION
// ===========================

const excelStart = parseDate(row.projectStart);
const excelEnd = parseDate(row.projectEnd);

/*
Allowed:
✔ No dates
✔ Only Start Date
✔ Only End Date
✔ Both Dates

Only validate order when BOTH dates exist.
*/

if (

    excelStart &&

    excelEnd &&

    excelEnd < excelStart

) {

    validationErrors.push({

        field: "Project Dates",

        entered:
            `${row.projectStart || "-"} → ${row.projectEnd || "-"}`,

        expected:
            "Start Date must be before End Date",

        message:
            "Project End Date cannot be before Project Start Date."

    });

}

        // ===========================
        // STATUS VALIDATION
        // ===========================

        if (

    row.status &&

    !VALID_STATUS.includes(row.status)

) {

    validationErrors.push({

        field: "Status",

        entered: row.status,

        expected: VALID_STATUS.join(", "),

        message:
            `Invalid Status "${row.status}".`

    });

}

        // ===========================
        // CHANGE DETECTION
        // ===========================

        const changedFields = [];
        // Start Date

        if (!isSameDate(excelStart, project.startDate)) {

    changedFields.push({

    field: "Start Date",

    oldValue: formatDate(project.startDate),

    newValue: formatDate(excelStart),

});
}

        // End Date

       if (!isSameDate(excelEnd, project.endDate)) {

    changedFields.push({

    field: "End Date",

    oldValue: formatDate(project.endDate),

    newValue: formatDate(excelEnd),

});

}

        // Status

        if (

            row.status !== project.status

        ) {
changedFields.push({

    field: "Status",

    oldValue: project.status || "-",

    newValue: row.status || "-",

});

        }

        // ===========================
        // PREVIEW
        // ===========================

        preview.push({

            projectId: project._id,

            project: project.name,

            projectStart: excelStart,

            projectEnd: excelEnd,

            status: row.status,

            changedFields,
            validationErrors,

        });

    }

    return {

        success: errors.length === 0,
hasValidationErrors: preview.some(
        project => project.validationErrors.length > 0
    ),
        errors,

        preview,

        summary: {

            totalRows: preview.length,

    changedProjects: preview.filter(
        p => p.changedFields.length > 0
    ).length,

    invalidProjects: preview.filter(
        p => p.validationErrors.length > 0
    ).length,

    unchangedProjects: preview.filter(
        p =>
            p.changedFields.length === 0 &&
            p.validationErrors.length === 0
    ).length,

        },

    };

};

module.exports = {

    validateProjectImport,

};