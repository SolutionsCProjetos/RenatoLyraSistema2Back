const express = require("express");
const sistemaLocomotorController = require("../../controllers/anamnese/sistemaLocomotorController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/locomotor/:petId", authMiddleware, sistemaLocomotorController.getSistemaLocomotor);
router.get("/locomotoP/:petId", authMiddleware, sistemaLocomotorController.getSistemaLocomotorP);
router.get("/locomotorPet/:id", authMiddleware, sistemaLocomotorController.getSistemaLocomotorId);
router.post("/locomotor", authMiddleware, sistemaLocomotorController.createSistemaLocomotor);
router.put("/locomotor/:id", authMiddleware, sistemaLocomotorController.updateSistemaLocomotor);
router.delete("/locomotor/:id", authMiddleware, sistemaLocomotorController.delSistemaLocomotor);

module.exports = router;
