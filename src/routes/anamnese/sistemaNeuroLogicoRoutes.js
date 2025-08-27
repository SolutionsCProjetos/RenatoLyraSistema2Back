const express = require("express");
const sistemaNeurologicoController = require("../../controllers/anamnese/sistemaNeurologicoController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/neuro/:petId", authMiddleware, sistemaNeurologicoController.getSistemaNeurologico);
router.get("/neuroP/:petId", authMiddleware, sistemaNeurologicoController.getSistemaNeurologicoP);
router.get("/neuroPet/:id", authMiddleware, sistemaNeurologicoController.getSistemaNeurologicoId);
router.post("/neuro", authMiddleware, sistemaNeurologicoController.createSistemaNeurologico);
router.put("/neuro/:id", authMiddleware, sistemaNeurologicoController.updateSistemaNeurologico);
router.delete("/neuro/:id", authMiddleware, sistemaNeurologicoController.delSistemaNeurologico);

module.exports = router;
