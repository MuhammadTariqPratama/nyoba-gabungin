const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/authJWT");

// auth
router.post("/register", authController.register);
router.post("/login", authController.login);

// crud user (protected routes)
router.get("/users", verifyToken, authController.getAllUsers);
router.get("/users/:id", verifyToken, authController.getUserById);
router.put("/users/:id", verifyToken, authController.updateUser);
router.delete("/users/:id", verifyToken, authController.deleteUser);

module.exports = router;
