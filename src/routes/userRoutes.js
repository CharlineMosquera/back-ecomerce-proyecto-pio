const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile/:id", authMiddleware, userController.getProfileUser);
router.get("/profiles", authMiddleware, userController.getAllProfileUser);
router.put("/profile/:id", authMiddleware, userController.updateProfileUser);
router.delete("/profile/:id", authMiddleware, userController.deleteUser);

module.exports = router;