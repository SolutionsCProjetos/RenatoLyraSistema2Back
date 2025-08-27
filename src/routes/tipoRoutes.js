const express = require("express");
const tipoController = require("../controllers/tipoController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/tipo", authMiddleware, tipoController.createTipos);
router.get("/tipo", authMiddleware, tipoController.getTipo);
router.get("/tipo/:id", authMiddleware, tipoController.getTipoId);
router.put("/tipo/:id", authMiddleware, tipoController.uptadeTipo);
router.delete("/tipo/:id", authMiddleware, tipoController.delTipo);

module.exports = router;
