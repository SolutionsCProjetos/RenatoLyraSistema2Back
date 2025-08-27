const express = require("express");
const tokenSenhaController = require("../controllers/tokenSenhaController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/token", authMiddleware, tokenSenhaController.createToken);
router.put("/token", authMiddleware, tokenSenhaController.updatePassword);

module.exports = router;