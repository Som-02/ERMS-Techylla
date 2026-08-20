const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({

    skill: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    }

});

const assignmentSchema = new mongoose.Schema({

    client: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Client",

        required: true,

    },

    project: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Project",

        required: true,

    },
    role: {
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
        },
        name: {
            type: String,
            required: true,
        },
    },

    location: {
        type: String,
        enum: [
            "Onshore / US",
            "Offshore / INDIA",
        ],
        required: true,
    },
    startDate: {

        type: Date,

        default:null,

    },

    endDate: {

        type: Date,

        default:null,

    },

    allocation: {

        type: Number,
        min:0,
        max:100,
        default: 0,

    },

});

const employeeSchema = new mongoose.Schema({

    empId: {

        type: String,

        required: true,

        unique: true

    },

    name: {

        type: String,

        required: true

    },

    email: {

        type: String,

        unique: true,
        sparse: true
    },

    mobile: String,
    
    location: {
    type: String,
    enum: [
        "Offshore / INDIA",
        "Onshore / US"
    ],
    required: true,
},
    // wwid: String,

    position: String,

    experience: Number,

    reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
},
    isReportingManager: {
    type: Boolean,
    default: false,
},

    skills: [skillSchema],

    assignments: [assignmentSchema],
    lastLogoutAt: {
    type: Date,
    default: null,
},
}, {

    timestamps: true

});

module.exports = mongoose.model("Employee", employeeSchema);