const express = require('express');
const usuaraioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/usuario", authMiddleware, usuaraioController.createUser);
router.get('/usuario', authMiddleware, usuaraioController.getUsers);
router.get('/usuario/:id', authMiddleware, usuaraioController.getUserById);
router.put('/usuario/:id', authMiddleware, usuaraioController.updateUser);
router.delete('/usuario/:id', authMiddleware, usuaraioController.deleteUser);

module.exports = router;
