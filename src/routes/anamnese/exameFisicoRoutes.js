const express = require("express");
const exameFisicoController = require("../../controllers/anamnese/exameFisicoController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/exameFisico/:petId", authMiddleware, exameFisicoController.getExameFisico);
router.get("/exameFisicoP/:petId", authMiddleware, exameFisicoController.getExameFisicoP);
router.get("/exameFisicoPet/:id", authMiddleware, exameFisicoController.getExameFisicoId);
router.post("/exameFisico", authMiddleware, exameFisicoController.createExameFisico);
router.put("/exameFisico/:id", authMiddleware, exameFisicoController.updateExameFisico);
router.delete("/exameFisico/:id", authMiddleware, exameFisicoController.delExameFisico);

module.exports = router;
