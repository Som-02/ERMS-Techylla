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
    }

},{
    timestamps:true
});

module.exports=mongoose.model("Project",projectSchema);