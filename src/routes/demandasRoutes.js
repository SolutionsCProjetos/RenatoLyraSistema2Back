const express = require("express");
const DemandaController = require("../controllers/DemandasController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/demanda", authMiddleware, DemandaController.createDemanda);
router.get("/demanda", authMiddleware, DemandaController.getDemandas);
router.get("/demanda/:id", authMiddleware, DemandaController.getDemandaId);
router.put("/demanda/:id", authMiddleware, DemandaController.uploadDemanda);
router.delete("/demanda/:id", authMiddleware, DemandaController.deleteDemanda);

module.exports = router;