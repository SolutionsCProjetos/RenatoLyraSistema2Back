const express = require('express');
const pagamentoController = require('../controllers/pagamentoController');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/pagamento", authMiddleware, pagamentoController.createPagamento);
router.get("/pagamento", authMiddleware, pagamentoController.getPagamento);
router.get("/pagamento/:id", authMiddleware, pagamentoController.getPagamentoId);
router.put("/pagamento/:id", authMiddleware, pagamentoController.updatePagamento);
router.delete("/pagamento/:id", authMiddleware, pagamentoController.delPagamento);

module.exports = router;