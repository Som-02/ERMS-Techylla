const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");

const generateToken = require("../utils/generateToken");


// =========================
// LOGIN
// =========================

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        if (!admin.isActive) {

            return res.status(403).json({
                success: false,
                message: "Admin account is disabled"
            });

        }

        const match = await bcrypt.compare(
            password,
            admin.password
        );

        if (!match) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        res.json({

            success: true,

            message: "Login Successful",

            token: generateToken(admin._id),

            mustChangePassword: admin.mustChangePassword,

            admin: {

                id: admin._id,

                name: admin.name,

                email: admin.email,

                role: admin.role

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =========================
// CHANGE PASSWORD
// =========================

const changePassword = async (req, res) => {

    try {

        const {

            currentPassword,

            newPassword,

            confirmPassword

        } = req.body;

        if (newPassword !== confirmPassword) {

            return res.status(400).json({

                success: false,

                message: "Passwords do not match"

            });

        }

        const admin = await Admin.findById(req.admin._id);

        const validPassword = await bcrypt.compare(

            currentPassword,

            admin.password

        );

        if (!validPassword) {

            return res.status(400).json({

                success: false,

                message: "Current Password is incorrect"

            });

        }

        admin.password = await bcrypt.hash(

            newPassword,

            10

        );

        admin.mustChangePassword = false;

        await admin.save();

        res.json({

            success: true,

            message: "Password Changed Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =========================
// GET PROFILE
// =========================

const getProfile = async (req, res) => {

    try {

        const admin = await Admin.findById(req.admin._id)
            .select("-password");

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Admin not found"

            });

        }

        res.json({

            success: true,

            data: admin

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =========================
// UPDATE PROFILE
// =========================

const updateProfile = async (req, res) => {

    try {

        const { name, email } = req.body;

        const admin = await Admin.findById(req.admin._id);

        if (!admin) {

            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });

        }

        // Check duplicate email
        const existingAdmin = await Admin.findOne({
            email,
            _id: { $ne: admin._id }
        });

        if (existingAdmin) {

            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });

        }

        admin.name = name;
        admin.email = email;

        await admin.save();

        res.json({

    success: true,

    message: "Profile Updated Successfully",

    admin: {

        id: admin._id,

        name: admin.name,

        email: admin.email,

        role: admin.role

    }

});

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    login,

    changePassword,
    getProfile,
    updateProfile
};