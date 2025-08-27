const express = require("express");
const CandidatoController = require("../controllers/candidatosController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/emprego", authMiddleware, CandidatoController.createEmpregos);
router.get("/empregos", authMiddleware, CandidatoController.getEmpregos);
router.get("/emprego/:id", authMiddleware, CandidatoController.getEmpregoId);
router.put("/emprego/:id", authMiddleware, CandidatoController.updateEmpregos);
router.delete("/emprego/:id", authMiddleware, CandidatoController.delCandidato);

module.exports = router;