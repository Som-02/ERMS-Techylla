const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    mustChangePassword:{
        type:Boolean,
        default:true
    },

    isActive:{
        type:Boolean,
        default:true
    },

    role: {
    type: String,
    default: "Administrator"
},
},{
    timestamps:true
});

module.exports = mongoose.model("Admin", adminSchema);