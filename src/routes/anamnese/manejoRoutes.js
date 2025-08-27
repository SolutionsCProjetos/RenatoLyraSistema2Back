const express = require("express");
const manejoController = require("../../controllers/anamnese/manejoController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/manejo/:petId", authMiddleware, manejoController.getManejo);
router.get("/manejoP/:petId", authMiddleware, manejoController.getManejoP);
router.get("/manejoPet/:id", authMiddleware, manejoController.getManejoId);
router.post("/manejo", authMiddleware, manejoController.createManejo);
router.put("/manejo/:id", authMiddleware, manejoController.updateManejo);
router.delete("/manejo/:id",authMiddleware,manejoController.delManejo);

module.exports = router;
