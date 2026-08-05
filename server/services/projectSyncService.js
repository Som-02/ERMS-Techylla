const mongoose = require("mongoose");
const Project = require("../models/Project");

// =======================================
// Parse Date
// =======================================

const parseDate = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

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

    const parsed = new Date(str);

    return isNaN(parsed.getTime())
        ? null
        : parsed;

};

// =======================================
// Compare Dates
// =======================================

const isSameDate = (a, b) => {

    if (!a && !b) return true;

    if (!a || !b) return false;

    return (
        new Date(a).toDateString() ===
        new Date(b).toDateString()
    );

};

// =======================================
// Sync Single Project
// =======================================

const syncProject = async (

    row,

    session

) => {

    const project = await Project.findById(
        row.projectId
    ).session(session);

    if (!project) {

        throw new Error(
            `${row.project} not found.`
        );

    }

    let updated = false;

    const startDate = parseDate(
        row.projectStart
    );

    const endDate = parseDate(
        row.projectEnd
    );

    // ----------------------------
    // Start Date
    // ----------------------------

    if (
        !isSameDate(
            startDate,
            project.startDate
        )
    ) {

        project.startDate = startDate;

        updated = true;

    }

    // ----------------------------
    // End Date
    // ----------------------------

    if (
        !isSameDate(
            endDate,
            project.endDate
        )
    ) {

        project.endDate = endDate;

        updated = true;

    }

    // ----------------------------
    // Status
    // ----------------------------

    if (
        row.status !== project.status
    ) {

        project.status = row.status;

        updated = true;

    }

    if (updated) {

        await project.save({
            session,
        });

    }

    return {

        project: project.name,

        updated,

    };

};

// =======================================
// Import Projects
// =======================================

const importProjects = async (
    preview
) => {

    const session =
        await mongoose.startSession();

    try {

        let updatedProjects = 0;

        let skippedProjects = 0;

        const projects = [];

        await session.withTransaction(
            async () => {

                for (const row of preview) {

                    const result =
                        await syncProject(
                            row,
                            session
                        );

                    projects.push(result);

                    if (result.updated) {

                        updatedProjects++;

                    }

                    else {

                        skippedProjects++;

                    }

                }

            }
        );

        session.endSession();

        return {

            success: true,

            summary: {

                importedProjects:
                    preview.length,

                updatedProjects,

                skippedProjects,

            },

            projects,

        };

    }

    catch (error) {

        session.endSession();

        throw error;

    }

};

module.exports = {

    importProjects,

};