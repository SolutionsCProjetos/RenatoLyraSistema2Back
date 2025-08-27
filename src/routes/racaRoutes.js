const express = require("express");
const racaController = require("../controllers/racaController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/raca", authMiddleware, racaController.createRacas);
router.get("/raca", authMiddleware, racaController.getRacas);
router.get("/raca/:id", authMiddleware, racaController.getRacaId);
router.put("/raca/:id", authMiddleware, racaController.uptadeRaca);
router.delete("/raca/:id", authMiddleware, racaController.delRaca);

module.exports = router;
