const express = require("express");
const vacinasController = require("../controllers/vacinasController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/vacina", authMiddleware, vacinasController.createVacinas);
router.get("/vacina", authMiddleware, vacinasController.getVacinas);
router.get("/vacina/:id", authMiddleware, vacinasController.getVacinasId);
router.put("/vacina/:id", authMiddleware, vacinasController.uptadeVacinas);
router.delete("/vacina/:id", authMiddleware, vacinasController.delVacinas);

module.exports = router;
