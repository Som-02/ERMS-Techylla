const Employee = require("../models/Employee");
const Client = require("../models/Client");
const Project = require("../models/Project");

const getDashboard = async (req, res) => {

    try {

        const totalEmployees =
            await Employee.countDocuments();

        const totalClients =
            await Client.countDocuments();

        const totalProjects =
            await Project.countDocuments();

        const recentEmployees =
            await Employee.find()
                .sort({ createdAt: -1 })
                .limit(5);

        // ----------------------------
        // Fetch ALL projects
        // ----------------------------

        const projects = await Project.find()

            .populate("client", "name logo")

            .sort({ createdAt: -1 });

        // ----------------------------
        // Add Project Aging
        // ----------------------------

        const today = new Date();

const projectsWithAging = projects.map(project => {

    const agingStartDate =
        project.statusChangedAt ||
        project.createdAt;

    const aging = Math.floor(

        (today - agingStartDate) /

        (1000 * 60 * 60 * 24)

    );

    return {

        ...project.toObject(),

        aging,

    };

});

        const leadProjects = projectsWithAging.filter(

            project => project.status === "Lead"

        );

        const pipelineProjects = projectsWithAging.filter(

            project => project.status === "Pipeline"

        );

        const activeProjects = projectsWithAging.filter(

            project => project.status === "Active"

        );

        res.json({

            success: true,

            data: {

                totalEmployees,

                totalClients,

                totalProjects,

                recentEmployees,

                leadProjects,

                pipelineProjects,

                activeProjects,

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getDashboard

};