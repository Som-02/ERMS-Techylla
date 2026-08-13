const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const Employee = require("../models/Employee");

const generateToken = require("../utils/generateToken");

const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

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

            token: generateToken(
                admin._id,
                admin.role,
                admin.email
            ),

            mustChangePassword:
                admin.mustChangePassword,

            user: {

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

        const admin = await Admin.findById(
            req.admin._id
        );

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Admin not found"

            });

        }

        const validPassword =
            await bcrypt.compare(
                currentPassword,
                admin.password
            );

        if (!validPassword) {

            return res.status(400).json({

                success: false,

                message:
                    "Current Password is incorrect"

            });

        }

        admin.password =
            await bcrypt.hash(
                newPassword,
                10
            );

        admin.mustChangePassword = false;

        await admin.save();

        res.json({

            success: true,

            message:
                "Password Changed Successfully"

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

        const admin = await Admin.findById(
            req.admin._id
        ).select("-password");

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

        const {
            name,
            email
        } = req.body;

        const admin = await Admin.findById(
            req.admin._id
        );

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "Admin not found"

            });

        }

        // Check duplicate email

        const existingAdmin =
            await Admin.findOne({

                email,

                _id: {
                    $ne: admin._id
                }

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

            message:
                "Profile Updated Successfully",

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
// MICROSOFT LOGIN
// =========================

const microsoftLogin = async (req, res) => {

    try {

        const { idToken } = req.body;

        if (!idToken) {

            return res.status(400).json({

                success: false,

                message:
                    "Microsoft ID token is required"

            });

        }

        // ==========================================
        // MICROSOFT SIGNING KEYS
        // ==========================================

        const client = jwksClient({

            jwksUri:
                `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/discovery/v2.0/keys`

        });

        const getKey = (header, callback) => {

            client.getSigningKey(

                header.kid,

                (err, key) => {

                    if (err) {

                        return callback(err);

                    }

                    const signingKey =
                        key.getPublicKey();

                    callback(
                        null,
                        signingKey
                    );

                }

            );

        };

        // ==========================================
        // VERIFY MICROSOFT ID TOKEN
        // ==========================================

        const decoded =
            await new Promise(

                (resolve, reject) => {

                    jwt.verify(

                        idToken,

                        getKey,

                        {

                            audience:
                                process.env.MICROSOFT_CLIENT_ID,

                            issuer:
                                `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/v2.0`

                        },

                        (
                            error,
                            decodedToken
                        ) => {

                            if (error) {

                                reject(error);

                            }
                            else {

                                resolve(
                                    decodedToken
                                );

                            }

                        }

                    );

                }

            );

        // ==========================================
        // GET MICROSOFT EMAIL
        // ==========================================

        const email = (

            decoded.preferred_username ||

            decoded.email ||

            decoded.upn ||

            ""

        ).toLowerCase();

        if (!email) {

            return res.status(401).json({

                success: false,

                message:
                    "Microsoft account email not found"

            });

        }

        // ==========================================
        // GET MICROSOFT APP ROLES
        // ==========================================

        const roles =
            decoded.roles || [];

        console.log(
            "Microsoft authenticated email:",
            email
        );

        console.log(
            "Microsoft roles:",
            roles
        );

        // ==========================================
        // FIND EMPLOYEE RECORD
        // ==========================================
        //
        // Both Administrators and Employees
        // exist in the Employee collection.
        //
        // Microsoft email must match an
        // Employee.email record.
        //
        // ==========================================

        const employee =
            await Employee.findOne({

                email: {

                    $regex: `^${email}$`,

                    $options: "i"

                }

            });

        if (!employee) {

            return res.status(403).json({

                success: false,

                message:
                    "Your Microsoft email is not registered in the employee database."

            });

        }

        console.log(
            "Employee found:",
            employee.name
        );

        // ==========================================
        // ADMINISTRATOR HAS PRIORITY
        // ==========================================

        if (
            roles.includes("Administrator")
        ) {

            console.log(
                "✅ Administrator role verified"
            );

            const token =
                generateToken(

                    employee._id,

                    "Administrator",

                    employee.email

                );

            return res.json({

                success: true,

                message:
                    "Microsoft Administrator login successful",

                token,

                mustChangePassword: false,

                user: {

                    id: employee._id,

                    name: employee.name,

                    email: employee.email,

                    role: "Administrator"

                }

            });

        }

        // ==========================================
        // EMPLOYEE
        // ==========================================

        if (
            roles.includes("Employee")
        ) {

            console.log(
                "✅ Employee role verified"
            );

            const token =
                generateToken(

                    employee._id,

                    "Employee",

                    employee.email

                );

            return res.json({

                success: true,

                message:
                    "Microsoft Employee login successful",

                token,

                mustChangePassword: false,

                user: {

                    id: employee._id,

                    name: employee.name,

                    email: employee.email,

                    role: "Employee"

                }

            });

        }

        // ==========================================
        // NO VALID ROLE
        // ==========================================

        return res.status(403).json({

            success: false,

            message:
                "You are not assigned an Administrator or Employee role."

        });

    }

    catch (error) {

        console.error(
            "Microsoft login error:",
            error
        );

        return res.status(401).json({

            success: false,

            message:
                "Microsoft authentication failed"

        });

    }

};


// =========================
// EXPORTS
// =========================

module.exports = {

    login,

    microsoftLogin,

    changePassword,

    getProfile,

    updateProfile

};