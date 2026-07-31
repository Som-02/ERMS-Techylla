require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const createAdmin = async () => {
    try {

        await connectDB();

        const email = "admin@company.com";
        const password = "admin123";

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
            name: "Administrator",
            email,
            password: hashedPassword,
        });

        console.log("=================================");
        console.log("Admin Created Successfully");
        console.log("---------------------------------");
        console.log(`Email    : ${email}`);
        console.log(`Password : ${password}`);
        console.log("=================================");

        process.exit(0);

    } catch (error) {

        console.error("Failed to create admin:", error.message);
        process.exit(1);

    }
};

createAdmin();