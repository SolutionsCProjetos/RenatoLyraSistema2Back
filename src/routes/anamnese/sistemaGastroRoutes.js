const express = require("express");
const sistemaGastroController = require("../../controllers/anamnese/sistemaGastroController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/gastro/:petId", authMiddleware, sistemaGastroController.getSistemaGastro);
router.get("/gastroP/:petId", authMiddleware, sistemaGastroController.getSistemaGastroP);
router.get("/gastroPet/:id", authMiddleware, sistemaGastroController.getSistemaGastroId);
router.post("/gastro", authMiddleware, sistemaGastroController.createSistemaGastro);
router.put("/gastro/:id", authMiddleware, sistemaGastroController.updateSistemaGastro);
router.delete("/gastro/:id", authMiddleware, sistemaGastroController.delSistemaGastro);

module.exports = router;
