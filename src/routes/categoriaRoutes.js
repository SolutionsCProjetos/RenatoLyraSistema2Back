const express = require('express');
const categoriaController = require("../controllers/categoriasController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/categoria', authMiddleware, categoriaController.createCategorias);
router.get('/categoria', authMiddleware, categoriaController.getCategoria);
router.get('/categoria/:id', authMiddleware, categoriaController.getCategoriaId);
router.put(
  "/categoria/:id",
  authMiddleware,
  categoriaController.updateCategoria
);
router.delete('/categoria/:id', authMiddleware, categoriaController.delCategoria);

module.exports = router;