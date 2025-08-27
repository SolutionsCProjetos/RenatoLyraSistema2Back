const express = require('express');
const operacaoController = require('../controllers/operacaoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/operacao', authMiddleware, operacaoController.createOperation);
router.get("/operacoes", authMiddleware, operacaoController.getAllOperations);
router.get('/operacao/:id',authMiddleware, operacaoController.getOperationById);
router.put('/operacao/:id', authMiddleware, operacaoController.updateOperation);
router.delete('/operacao/:id', authMiddleware, operacaoController.deleteOperation);
router.get('/userOpe', authMiddleware, operacaoController.getOperationByUser);
router.get("/userOpe/:id", authMiddleware, operacaoController.getOperationByUserId);

module.exports = router;
