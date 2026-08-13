const mongoose = require("mongoose");

const skillChangeRequestSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "ADD",
                "REMOVE",
                "UPDATE"
            ],
            required: true,
        },

        skill: {
            type: String,
            required: true,
        },

        oldRating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },

        newRating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "APPROVED",
                "REJECTED"
            ],
            default: "PENDING",
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null,
        },

        reviewedAt: {
            type: Date,
            default: null,
        },

        rejectionReason: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "SkillChangeRequest",
    skillChangeRequestSchema
);