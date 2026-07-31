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

        const activeProjects =
            await Project.find({ status: "Active" })
                .populate("client")
                .limit(5);

        const recentEmployees =
            await Employee.find()
                .sort({ createdAt: -1 })
                .limit(5);

        res.json({

            success: true,

            data: {

                totalEmployees,

                totalClients,

                totalProjects,

                activeProjects,

                recentEmployees

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {
    getDashboard
};