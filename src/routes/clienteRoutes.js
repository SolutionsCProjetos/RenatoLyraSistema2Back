const express = require("express");
const ClientesController = require("../controllers/clientesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/cliente", authMiddleware, ClientesController.createClientes);
router.get("/cliente", authMiddleware, ClientesController.getClientes);
router.get("/cliente/:id", authMiddleware, ClientesController.getClienteId);
router.put("/cliente/:id", authMiddleware, ClientesController.uploadCliente);
router.delete("/cliente/:id", authMiddleware, ClientesController.deleteCliente);

module.exports = router;
