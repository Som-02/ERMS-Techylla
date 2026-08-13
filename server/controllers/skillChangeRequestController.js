const SkillChangeRequest = require("../models/SkillChangeRequest");
const Employee = require("../models/Employee");


// ==========================================
// CREATE SKILL CHANGE REQUEST
// EMPLOYEE
// ==========================================

const createSkillChangeRequest = async (req, res) => {

    try {

        const {
            type,
            skill,
            oldRating,
            newRating,
        } = req.body;


        if (!type || !skill) {

            return res.status(400).json({
                success: false,
                message: "Skill request data is incomplete",
            });

        }


        if (
            ![
                "ADD",
                "REMOVE",
                "UPDATE"
            ].includes(type)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid skill request type",
            });

        }


        /*
        Only employees can submit
        skill change requests.
        */

        if (req.user.role !== "Employee") {

            return res.status(403).json({
                success: false,
                message:
                    "Only employees can submit skill requests",
            });

        }


        const employee =
            await Employee.findById(req.user.id);


        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });

        }


        /*
        Prevent duplicate pending
        requests for same employee + skill.
        */

        const existingRequest =
            await SkillChangeRequest.findOne({

                employee: req.user.id,

                skill: skill,

                status: "PENDING",

            });


        if (existingRequest) {

            return res.status(400).json({
                success: false,
                message:
                    "A pending request already exists for this skill",
            });

        }


        /*
        ======================================
        ADD
        ======================================
        */

        if (type === "ADD") {

            const exists =
                employee.skills.some(
                    item =>
                        item.skill.toLowerCase() ===
                        skill.toLowerCase()
                );


            if (exists) {

                return res.status(400).json({
                    success: false,
                    message:
                        "This skill already exists",
                });

            }

        }


        /*
        ======================================
        REMOVE
        ======================================
        */

        if (type === "REMOVE") {

            const exists =
                employee.skills.some(
                    item =>
                        item.skill.toLowerCase() ===
                        skill.toLowerCase()
                );


            if (!exists) {

                return res.status(400).json({
                    success: false,
                    message:
                        "This skill does not exist",
                });

            }

        }


        /*
        ======================================
        UPDATE
        ======================================
        */

        if (type === "UPDATE") {

            const existingSkill =
                employee.skills.find(
                    item =>
                        item.skill.toLowerCase() ===
                        skill.toLowerCase()
                );


            if (!existingSkill) {

                return res.status(400).json({
                    success: false,
                    message:
                        "This skill does not exist",
                });

            }


            if (
                Number(existingSkill.rating) ===
                Number(newRating)
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "New rating is same as current rating",
                });

            }

        }


        /*
        Create pending request.

        IMPORTANT:
        Employee.skills is NOT modified here.
        */

        const request =
            await SkillChangeRequest.create({

                employee: req.user.id,

                type,

                skill,

                oldRating:
                    oldRating ?? null,

                newRating:
                    newRating ?? null,

                status: "PENDING",

            });


        const populatedRequest =
            await SkillChangeRequest
                .findById(request._id)
                .populate(
                    "employee",
                    "empId name email position"
                );


        return res.status(201).json({

            success: true,

            message:
                "Skill change request submitted successfully",

            data: populatedRequest,

        });

    }

    catch (error) {

        console.error(
            "Create skill change request error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


// ==========================================
// GET MY REQUESTS
// EMPLOYEE
// ==========================================

const getMySkillChangeRequests = async (
    req,
    res
) => {

    try {

        const requests =
            await SkillChangeRequest
                .find({
                    employee: req.user.id,
                })
                .sort({
                    createdAt: -1,
                });


        return res.json({

            success: true,

            data: requests,

        });

    }

    catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


// ==========================================
// GET PENDING REQUESTS
// ADMIN
// ==========================================

const getPendingSkillChangeRequests = async (
    req,
    res
) => {

    try {

        if (
            req.user.role !== "Administrator"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Administrator access required",
            });

        }


        const requests =
            await SkillChangeRequest
                .find({
                    status: "PENDING",
                })
                .populate(
                    "employee",
                    "empId name email position"
                )
                .sort({
                    createdAt: -1,
                });


        return res.json({

            success: true,

            data: requests,

        });

    }

    catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


// ==========================================
// APPROVE
// ADMIN
// ==========================================

const approveSkillChangeRequest = async (
    req,
    res
) => {

    try {

        if (
            req.user.role !== "Administrator"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Administrator access required",
            });

        }


        const request =
            await SkillChangeRequest.findById(
                req.params.id
            );


        if (!request) {

            return res.status(404).json({
                success: false,
                message:
                    "Skill request not found",
            });

        }


        if (request.status !== "PENDING") {

            return res.status(400).json({
                success: false,
                message:
                    "This request has already been processed",
            });

        }


        const employee =
            await Employee.findById(
                request.employee
            );


        if (!employee) {

            return res.status(404).json({
                success: false,
                message:
                    "Employee not found",
            });

        }


        /*
        ======================================
        ADD
        ======================================
        */

        if (request.type === "ADD") {

            const exists =
                employee.skills.some(
                    item =>
                        item.skill.toLowerCase() ===
                        request.skill.toLowerCase()
                );


            if (exists) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Skill already exists for employee",
                });

            }


            employee.skills.push({

                skill: request.skill,

                rating:
                    Number(
                        request.newRating
                    ),

            });

        }


        /*
        ======================================
        REMOVE
        ======================================
        */

        if (request.type === "REMOVE") {

            employee.skills =
                employee.skills.filter(
                    item =>
                        item.skill.toLowerCase() !==
                        request.skill.toLowerCase()
                );

        }


        /*
        ======================================
        UPDATE RATING
        ======================================
        */

        if (request.type === "UPDATE") {

            const existingSkill =
                employee.skills.find(
                    item =>
                        item.skill.toLowerCase() ===
                        request.skill.toLowerCase()
                );


            if (!existingSkill) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Skill no longer exists",
                });

            }


            existingSkill.rating =
                Number(
                    request.newRating
                );

        }


        await employee.save();


        /*
        Mark request as approved.
        */

        request.status = "APPROVED";

        request.reviewedBy =
            req.user.id;

        request.reviewedAt =
            new Date();


        await request.save();


        return res.json({

            success: true,

            message:
                "Skill request approved successfully",

            data: request,

        });

    }

    catch (error) {

        console.error(
            "Approve skill change request error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


// ==========================================
// REJECT
// ADMIN
// ==========================================

const rejectSkillChangeRequest = async (
    req,
    res
) => {

    try {

        if (
            req.user.role !== "Administrator"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Administrator access required",
            });

        }


        const request =
            await SkillChangeRequest.findById(
                req.params.id
            );


        if (!request) {

            return res.status(404).json({
                success: false,
                message:
                    "Skill request not found",
            });

        }


        if (request.status !== "PENDING") {

            return res.status(400).json({
                success: false,
                message:
                    "This request has already been processed",
            });

        }


        request.status = "REJECTED";

        request.reviewedBy =
            req.user.id;

        request.reviewedAt =
            new Date();

        request.rejectionReason =
            req.body.reason || "";


        await request.save();


        return res.json({

            success: true,

            message:
                "Skill request rejected",

            data: request,

        });

    }

    catch (error) {

        console.error(
            "Reject skill change request error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


module.exports = {

    createSkillChangeRequest,

    getMySkillChangeRequests,

    getPendingSkillChangeRequests,

    approveSkillChangeRequest,

    rejectSkillChangeRequest,

};