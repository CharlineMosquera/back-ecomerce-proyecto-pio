const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", authMiddleware, userController.getProfileUser);
router.put("/profile", authMiddleware, userController.updateProfileUser);

module.exports = router;