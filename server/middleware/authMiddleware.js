const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Employee = require("../models/Employee");

const protect = async (req, res, next) => {

    try {

        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            token =
                req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            /*
            ==========================================
            NEW MICROSOFT / ROLE BASED TOKEN
            ==========================================
            */

            if (decoded.role) {

                const employee =
                    await Employee.findById(decoded.id)
                        .select("-password");

                if (!employee) {

                    return res.status(401).json({

                        success: false,

                        message:
                            "User account not found"

                    });

                }

                /*
                Store authenticated user
                */

                req.user = {

                    id: employee._id,

                    name: employee.name,

                    email: employee.email,

                    role: decoded.role

                };

                /*
                Keep req.admin temporarily
                for existing Admin-side code.

                */

                if (
                    decoded.role === "Administrator"
                ) {

                    req.admin = employee;

                }

                return next();

            }

            /*
            ==========================================
            OLD ADMIN TOKEN
            ==========================================
            
            Keep this temporarily so your old
            Admin collection login does not
            suddenly break.
            
            */

            const admin =
                await Admin.findById(decoded.id)
                    .select("-password");

            if (!admin) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Admin account not found"

                });

            }

            req.admin = admin;

            req.user = {

                id: admin._id,

                name: admin.name,

                email: admin.email,

                role: admin.role

            };

            return next();

        }

        return res.status(401).json({

            success: false,

            message: "Not Authorized"

        });

    }

    catch (error) {

        console.error(
            "Authentication middleware error:",
            error
        );

        return res.status(401).json({

            success: false,

            message: "Token Invalid"

        });

    }

};

module.exports = {

    protect

};