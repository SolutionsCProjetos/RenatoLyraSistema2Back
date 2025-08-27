const express = require('express');
const PetController = require("../controllers/petController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/pet', authMiddleware, PetController.getPet);
router.get('/pet/:id', authMiddleware, PetController.getPetId);
router.get('/petcliente/:clienteId', authMiddleware, PetController.getPetCliente);
router.post('/pet', authMiddleware, PetController.createPet);
router.put('/pet/:id', authMiddleware, PetController.updatePet);
router.delete('/pet/:id', authMiddleware, PetController.deletePet);

module.exports = router;