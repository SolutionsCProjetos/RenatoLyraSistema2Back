const express = require("express");
const { gerarRelatorioClientes, gerarRelatorioContas, gerarRelatorioReceber, gerarRelatorioEmpregabilidade } = require("../controllers/relatorioController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//router.get("/relatorioCliente", authMiddleware, gerarRelatorioClientes);
//router.get("/relatorioReceber", authMiddleware, gerarRelatorioReceber);
//router.get("/relatorioPagar", authMiddleware, gerarRelatorioContas);
router.get(
  "/relatorioEmpregabilidade",
  authMiddleware,
  gerarRelatorioEmpregabilidade
);

module.exports = router;
