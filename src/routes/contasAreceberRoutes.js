const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const receberController = require("../controllers/receberController");

router.get("/receber", authMiddleware, receberController.getReceber);
router.get('/receber/:id', authMiddleware,  receberController.getReceberId);
router.get("/recebercliente/:clienteId", authMiddleware, receberController.getReceberCliente);
router.post("/receber", authMiddleware, receberController.createReceber);
router.put("/receber/:id", authMiddleware, receberController.updateReceber);
router.delete("/receber/:id", authMiddleware, receberController.delReceber);

module.exports = router;