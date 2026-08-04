const Project = require("../models/Project");
const Employee = require("../models/Employee");

// ============================
// Get All Projects
// ============================

const getProjects = async (req, res) => {

    try {

        const filter = {};

        if (req.query.client) {

            filter.client = req.query.client;

        }

        const projects = await Project.find(filter)
            .populate("client")
            .populate("requiredSkills", "name")
            .sort({ name: 1 });

        res.status(200).json({

            success: true,

            data: projects,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ============================
// Get Project By ID
// ============================

const getProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id)
            .populate("client")
            .populate("requiredSkills", "name");

        if (!project) {

            return res.status(404).json({

                success: false,

                message: "Project not found",

            });

        }

        const employees = await Employee.find({

            "assignments.project": project._id,

        });

        const employeeList = employees.map((employee) => {

            const assignment = employee.assignments.find(

                (assignment) =>

                    assignment.project.toString() ===

                    project._id.toString()

            );

            return {

                _id: employee._id,

                empId: employee.empId,

                name: employee.name,

                position: employee.position,

                experience: employee.experience,

                startDate: assignment?.startDate || null,

                endDate: assignment?.endDate || null,

                allocation: assignment?.allocation || 0,

            };

        });

        res.status(200).json({

            success: true,

            data: {

                project,

                employees: employeeList,

            },

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ============================
// Create Project
// ============================

const createProject = async (req, res) => {

    try {

        if (

            req.body.startDate &&

            req.body.endDate &&

            new Date(req.body.endDate) <

                new Date(req.body.startDate)

        ) {

            return res.status(400).json({

                success: false,

                message:

                    "Project End Date cannot be before Start Date.",

            });

        }

        const {

            assignedEmployees,

            ...projectData

        } = req.body;

        projectData.assignedEmployees = assignedEmployees;

const project = await Project.create(projectData);

        if (

            assignedEmployees &&

            assignedEmployees.length > 0

        ) {

            for (const employeeId of assignedEmployees) {

                const employee = await Employee.findById(employeeId);

                if (!employee) continue;

                const alreadyAssigned = employee.assignments.some(

                    (assignment) =>

                        assignment.project.toString() ===

                        project._id.toString()

                );

                if (alreadyAssigned) {

                    continue;

                }

                employee.assignments.push({

                    client: project.client,

                    project: project._id,

                    startDate: project.startDate,

                    endDate: project.endDate,

                    allocation: 100,

                });

                await employee.save();

            }

        }

        res.status(201).json({

            success: true,

            message: "Project Created Successfully",

            data: project,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ============================
// Update Project
// ============================

const updateProject = async (req, res) => {

    try {

        if (
            req.body.startDate &&
            req.body.endDate &&
            new Date(req.body.endDate) <
                new Date(req.body.startDate)
        ) {

            return res.status(400).json({

                success:false,

                message:"Project End Date cannot be before Start Date."

            });

        }

        const {

            assignedEmployees=[],

            ...projectData

        } = req.body;

        projectData.assignedEmployees = assignedEmployees;

        const project = await Project.findByIdAndUpdate(

            req.params.id,

            projectData,

            {

                new:true,

                runValidators:true

            }

        );

        if(!project){

            return res.status(404).json({

                success:false,

                message:"Project not found"

            });

        }

        // =============================
        // Employees currently assigned
        // =============================

        const currentEmployees = await Employee.find({

            "assignments.project":project._id

        });

        // ===================================
        // Remove employees no longer assigned
        // ===================================

        for(const employee of currentEmployees){

            if(
                !assignedEmployees.includes(
                    employee._id.toString()
                )
            ){

                employee.assignments =
                    employee.assignments.filter(

                        assignment=>

                            assignment.project.toString() !==
                            project._id.toString()

                    );

                await employee.save();

            }

        }

        // ===================================
        // Add new / Update existing employees
        // ===================================

        for(const employeeId of assignedEmployees){

            const employee =
                await Employee.findById(employeeId);

            if(!employee) continue;

            const assignment =
                employee.assignments.find(

                    assignment=>

                        assignment.project.toString() ===
                        project._id.toString()

                );

            if(assignment){

                // Preserve allocation
                // Preserve custom dates if already changed

                assignment.client = project.client;

                if(
                    assignment.startDate?.getTime() ===
                    new Date(project.startDate).getTime()
                ){

                    assignment.startDate =
                        project.startDate;

                }

                if(
                    assignment.endDate?.getTime() ===
                    new Date(project.endDate).getTime()
                ){

                    assignment.endDate =
                        project.endDate;

                }

            }

            else{

                employee.assignments.push({

                    client:project.client,

                    project:project._id,

                    startDate:project.startDate,

                    endDate:project.endDate,

                    allocation:100

                });

            }

            await employee.save();

        }

        res.status(200).json({

            success:true,

            message:"Project Updated Successfully",

            data:project

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// ============================
// Delete Project
// ============================

const deleteProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id);

        if (!project) {

            return res.status(404).json({

                success: false,

                message: "Project not found",

            });

        }

        // Remove this project from every employee

        await Employee.updateMany(

            {

                "assignments.project": project._id,

            },

            {

                $pull: {

                    assignments: {

                        project: project._id,

                    },

                },

            }

        );

        await Project.findByIdAndDelete(project._id);

        res.status(200).json({

            success: true,

            message: "Project Deleted Successfully",

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ============================
// Search Projects
// ============================

const searchProjects = async (req, res) => {

    try {

        const q = req.query.q || "";

        const projects = await Project.find({

            name: {

                $regex: q,

                $options: "i",

            },

        })

            .populate("client")

            .populate("requiredSkills", "name");

        res.status(200).json({

            success: true,

            count: projects.length,

            data: projects,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// ============================
// Export Projects
// ============================

const exportProjects = async (req, res) => {

    try {

        const projects = await Project.find()

            .populate("client")

            .populate("requiredSkills", "name")

            .populate("assignedEmployees", "name empId");

        const result = [];

        for (const project of projects) {

            const employees = await Employee.find({

                "assignments.project": project._id,

            });

            const employeeList = employees.map(employee => {

                const assignment = employee.assignments.find(

                    assignment =>

                        assignment.project.toString() ===

                        project._id.toString()

                );

                return {

                    empId: employee.empId,

                    name: employee.name,

                    position: employee.position,

                    experience: employee.experience,

                    startDate: assignment?.startDate,

                    endDate: assignment?.endDate,

                    allocation: assignment?.allocation,

                };

            });

            result.push({

                _id: project._id,

                name: project.name,

                client: project.client,

                startDate: project.startDate,

                endDate: project.endDate,

                status: project.status,

                requiredSkills: project.requiredSkills,

                employees: employeeList,

            });

        }

        res.status(200).json({

            success: true,

            data: result,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
module.exports = {

    getProjects,

    getProject,
    exportProjects,
    searchProjects,

    createProject,

    updateProject,

    deleteProject,

};