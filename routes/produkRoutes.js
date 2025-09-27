const express = require("express");
const router = express.Router();
const produkController = require("../controllers/produkController");
const verifyToken = require("../middlewares/authJWT");

// Read
router.get("/", produkController.getAll);
router.get("/:id", produkController.getById);

// Create (butuh token)
router.post("/", verifyToken, produkController.create);

// Update (butuh token)
router.put("/:id", verifyToken, produkController.update);

// Delete (butuh token)
router.delete("/:id", verifyToken, produkController.delete);

module.exports = router;
