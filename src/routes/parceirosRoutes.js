const express = require('express');
const parceirosController = require("../controllers/parceirosController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/parceiro', authMiddleware, parceirosController.getParceiros);
router.get('/parceiro/:id', authMiddleware, parceirosController.getParceirosId);
router.post('/parceiro', authMiddleware, parceirosController.createParceiros);
router.put("/parceiro/:id", authMiddleware, parceirosController.updateParceiro);
router.delete('/parceiro/:id', authMiddleware, parceirosController.deleteParceiro);

module.exports = router;