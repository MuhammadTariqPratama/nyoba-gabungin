const express = require("express");
const router = express.Router();
const variasiController = require("../controllers/variasiController");
const verifyToken = require("../middlewares/authJWT");

// Read
router.get("/", variasiController.getAll);
router.get("/:id", variasiController.getById);

// Create (butuh token)
router.post("/", verifyToken, variasiController.create);

// Update (butuh token)
router.put("/:id", verifyToken, variasiController.update);

// Delete (butuh token)
router.delete("/:id", verifyToken, variasiController.delete);

module.exports = router;
