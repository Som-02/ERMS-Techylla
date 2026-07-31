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

        required: true

    },

    project: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Project",

        required: true

    },

    endDate: {

        type: Date,

        required: true

    }

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

    wwid: String,

    position: String,

    experience: Number,

    reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
},

    skills: [skillSchema],

    assignments: [assignmentSchema]

}, {

    timestamps: true

});

module.exports = mongoose.model("Employee", employeeSchema);