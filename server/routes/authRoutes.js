const express = require("express");

const router = express.Router();

const {

    login,
    microsoftLogin,
    changePassword,

    getProfile,
    updateProfile,
    logout
} = require("../controllers/authController");

const {

    protect

} = require("../middleware/authMiddleware");

router.post("/login", login);
router.post(
    "/microsoft-login",
    microsoftLogin
);
router.post(
    "/logout",
    protect,
    logout
);
router.get("/me", protect, getProfile);
router.put(
    "/change-password",
    protect,
    changePassword
);
router.put("/profile", protect, updateProfile);
module.exports = router;