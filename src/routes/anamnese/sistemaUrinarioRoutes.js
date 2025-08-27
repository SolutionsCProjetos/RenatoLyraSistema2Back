const express = require("express");
const sistemaUrinarioController = require("../../controllers/anamnese/sistemaUrinarioController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/urinario/:petId", authMiddleware, sistemaUrinarioController.getSistemaUrinario);
router.get("/urinarioP/:petId", authMiddleware, sistemaUrinarioController.getSistemaUrinarioP);
router.get("/urinarioPet/:id", authMiddleware, sistemaUrinarioController.getSistemaUrinarioId);
router.post("/urinario", authMiddleware, sistemaUrinarioController.createSistemaUrinario);
router.put("/urinario/:id", authMiddleware, sistemaUrinarioController.updateSistemaUrinario);
router.delete("/urinario/:id", authMiddleware, sistemaUrinarioController.delSistemaUrinario);

module.exports = router;
