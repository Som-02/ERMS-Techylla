const Skill = require("../models/Skill");
const Employee = require("../models/Employee");
// ===================================
// Get All Skills
// ===================================

const getSkills = async (req, res) => {

    try {

        const skills = await Skill.find()
            .sort({ name: 1 });

        res.status(200).json({

            success: true,

            data: skills

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ===================================
// Add Skill
// ===================================

const addSkill = async (req, res) => {

    try {

        const { name } = req.body;

        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message: "Skill name is required"

            });

        }

        const exists = await Skill.findOne({

            name: {
                $regex: `^${name.trim()}$`,
                $options: "i"
            }

        });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "Skill already exists"

            });

        }

        const skill = await Skill.create({

            name: name.trim()

        });

        res.status(201).json({

            success: true,

            message: "Skill Added Successfully",

            data: skill

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ===================================
// Update Skill
// ===================================

const updateSkill = async (req, res) => {

    try {

        const { name } = req.body;

        const exists = await Skill.findOne({

            _id: { $ne: req.params.id },

            name: {
                $regex: `^${name.trim()}$`,
                $options: "i"
            }

        });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "Skill already exists"

            });

        }

        const skill = await Skill.findByIdAndUpdate(

            req.params.id,

            {
                name: name.trim()
            },

            {
                new: true,
                runValidators: true
            }

        );

        if (!skill) {

            return res.status(404).json({

                success: false,

                message: "Skill not found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Skill Updated Successfully",

            data: skill

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ===================================
// Delete Skill
// ===================================

const deleteSkill = async (req, res) => {

    try {

        const skill = await Skill.findById(req.params.id);

        if (!skill) {

            return res.status(404).json({

                success: false,

                message: "Skill not found"

            });

        }

        await Skill.findByIdAndDelete(req.params.id);

        res.status(200).json({

            success: true,

            message: "Skill Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ===================================
// Skill Matrix
// ===================================

const getSkillMatrix = async (req, res) => {

    try {

        const skills = await Skill.find()
            .sort({ name: 1 });

        const employees = await Employee.find(
            {},
            "name empId skills"
        );

        const matrix = skills.map((skill) => {

            const result = {

                skill: skill.name,

                junior: [],

                intermediate: [],

                senior: []

            };

            employees.forEach((employee) => {

                employee.skills.forEach((empSkill) => {

                    if (empSkill.skill !== skill.name)
                        return;

                    const employeeInfo = {

                        _id: employee._id,

                        empId: employee.empId,

                        name: employee.name,

                        rating: empSkill.rating

                    };

                    if (empSkill.rating <= 2) {

                        result.junior.push(employeeInfo);

                    }

                    else if (empSkill.rating === 3) {

                        result.intermediate.push(employeeInfo);

                    }

                    else {

                        result.senior.push(employeeInfo);

                    }

                });

            });

            return result;

        });

        res.status(200).json({

            success: true,

            data: matrix

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

    getSkills,

    addSkill,
    getSkillMatrix,


    updateSkill,

    deleteSkill

};