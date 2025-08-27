const express = require("express");
const sistemaCardioController = require("../../controllers/anamnese/sistemaCardioController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/cardio/:petId", authMiddleware, sistemaCardioController.getSistemaCardio);
router.get("/cardioP/:petId", authMiddleware, sistemaCardioController.getSistemaCardioP);
router.get("/cardioPet/:id", authMiddleware, sistemaCardioController.getSistemaCardioId);
router.post("/cardio", authMiddleware, sistemaCardioController.createSistemaCardio);
router.put("/cardio/:id", authMiddleware, sistemaCardioController.updateSistemaCardio);
router.delete("/cardio/:id", authMiddleware, sistemaCardioController.delSistemaCardio);

module.exports = router;
