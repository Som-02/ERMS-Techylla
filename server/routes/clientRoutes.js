const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {

createClient,

getClient,

getClients,

updateClient,

deleteClient,

searchClients

}=require("../controllers/clientController");

router.get("/",protect,getClients);
router.get("/search", protect, searchClients);
router.post("/",protect,createClient);
router.get("/:id", protect, getClient);
router.put("/:id",protect,updateClient);

router.delete("/:id",protect,deleteClient);

module.exports=router;