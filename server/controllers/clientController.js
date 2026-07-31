const Client= require("../models/Client");

const getClients = async (req, res) => {

    try {

        const clients = await Client.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: clients,
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};
const Project = require("../models/Project");

const getClient = async (req, res) => {

    try {

        const client = await Client.findById(req.params.id);

        if (!client) {

            return res.status(404).json({
                message: "Client not found",
            });

        }

        const projects = await Project.find({
            client: client._id,
        });

        res.status(200).json({
    success: true,
    data: {
        ...client.toObject(),
        projects,
    },
});

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};
const createClient=async(req,res)=>{

try{

const client=await Client.create(req.body);

res.status(201).json(client);

}

catch(err){

res.status(500).json({message:err.message});

}

};

const updateClient=async(req,res)=>{

try{

const client=await Client.findByIdAndUpdate(

req.params.id,

req.body,

{new:true}

);

res.json(client);

}

catch(err){

res.status(500).json({message:err.message});

}

};

const deleteClient = async (req, res) => {

    try {

        const projectCount = await Project.countDocuments({
            client: req.params.id,
        });

        if (projectCount > 0) {

            return res.status(400).json({

                message:
                    "Cannot delete client. Projects are assigned to this client.",

            });

        }

        await Client.findByIdAndDelete(req.params.id);

        res.json({
            message: "Client Deleted",
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};

const searchClients = async (req, res) => {
    try {

        const q = req.query.q || "";

        const clients = await Client.find({
            name: {
                $regex: q,
                $options: "i",
            },
        });

        res.status(200).json({
    success: true,
    count: clients.length,
    data: clients,
});
        

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};
module.exports={

getClients,

getClient,

createClient,

updateClient,

deleteClient,

searchClients
};