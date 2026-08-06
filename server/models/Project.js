const mongoose=require("mongoose");

const projectSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },

    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client",
        required:true
    },

    status:{
        type:String,
        enum:["Active","Completed","On Hold"],
        default:"Active"
    },
    reference: {
    type: String,
    trim: true,
},

description: {
    type: String,
    trim: true,
},

type: {
    type: String,
    enum: [
        "AI",
        "BI & Analytics",
        "Consulting (SAP)",
        "Consulting (Data & Analytics)",
        "Integration",
    ],
},
    startDate: {
    type: Date,
    default: null
},

endDate: {
    type: Date,
    default: null
},

requiredSkills: [
    {
        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true,
        },

        resources: {

            onshore: {
                type: Number,
                default: 0,
                min: 0,
            },

            offshore: {
                type: Number,
                default: 0,
                min: 0,
            },

        },

    },
],
assignedEmployees: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
],

},{
    timestamps:true
});

module.exports=mongoose.model("Project",projectSchema);