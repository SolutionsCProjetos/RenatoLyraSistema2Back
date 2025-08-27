const express = require("express");
//const upload = require("../config/multer");
const router = express.Router();;
const authMiddleware = require("../middleware/authMiddleware");

const ContasController = require("../controllers/ContasController");

router.get("/pagar", authMiddleware, ContasController.getAllContas);
router.get("/pagar/:id", authMiddleware, ContasController.getAllContasId);
router.post(
  "/pagar",
  authMiddleware,
  ContasController.createContas
);
router.put("/pagar/:id", authMiddleware, ContasController.uploadContas);
router.delete("/pagar/:id", authMiddleware, ContasController.delContas);

module.exports = router;
