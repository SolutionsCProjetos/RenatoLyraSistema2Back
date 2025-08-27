const express = require("express");
const setorController = require("../controllers/setoresController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/setor", authMiddleware, setorController.createSetores);
router.get("/setor", authMiddleware, setorController.getSetores);
router.get("/setor/:id", authMiddleware, setorController.getSetoresId);
router.put("/setor/:id", authMiddleware, setorController.uptadeSetor);
router.delete("/setor/:id", authMiddleware, setorController.delSetor);

module.exports = router;
