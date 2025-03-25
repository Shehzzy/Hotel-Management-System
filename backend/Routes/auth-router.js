const express = require("express");
const router = express.Router();
const authController = require("../Controllers/auth-controller");

router.post("/register", authController.register);
router.get("/profile", authController.profileData);
router.post("/login", authController.login);
router.put("/update/:id", authController.update);

module.exports = router;
