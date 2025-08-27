const express = require("express");
const SolicitanteController = require("../controllers/solicitanteController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/solicitante", authMiddleware, SolicitanteController.createSolicitante);
router.get("/solicitante", authMiddleware, SolicitanteController.getSolicitantes);
router.get("/solicitante/:id", authMiddleware, SolicitanteController.getSolicitanteId);
router.put("/solicitante/:id", authMiddleware, SolicitanteController.uploadSolicitante);
router.delete("/solicitante/:id", authMiddleware, SolicitanteController.deleteSolicitante);

module.exports = router;