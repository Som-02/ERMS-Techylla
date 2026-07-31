const Project = require("../models/Project");


// ============================
// Get All Projects
// ============================]

const getProjects = async (req, res) => {
    try {

        const filter = {};

        // Filter by client if provided
        if (req.query.client) {
            filter.client = req.query.client;
        }

        const projects = await Project.find(filter)
            .populate("client")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: projects
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id)
            .populate("client");

        if (!project) {

            return res.status(404).json({

                success: false,
                message: "Project not found"

            });

        }

        res.status(200).json({

            success: true,
            data: project

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
// ============================
// Create Project
// ============================
const createProject = async (req, res) => {

    try {

        const project = await Project.create(req.body);

        res.status(201).json({

            success: true,

            data: project

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ============================
// Update Project
// ============================
const updateProject = async (req, res) => {

    try {

        const project = await Project.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        res.status(200).json({

            success: true,

            data: project

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ============================
// Delete Project
// ============================
const deleteProject = async (req, res) => {

    try {

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({

            success: true,

            message: "Project Deleted"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
const searchProjects = async (req, res) => {

    try {

        const q = req.query.q || "";

        const projects = await Project.find({

            name: {
                $regex: q,
                $options: "i"
            }

        }).populate("client");

        res.status(200).json({

            success: true,
            count: projects.length,
            data: projects

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

module.exports = {
    getProjects,
    getProject,
    searchProjects,
    createProject,
    updateProject,
    deleteProject
};