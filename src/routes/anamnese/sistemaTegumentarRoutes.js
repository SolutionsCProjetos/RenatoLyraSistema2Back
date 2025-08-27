const express = require("express");
const sistemaTegumentaController = require("../../controllers/anamnese/sistemaTegumentaController");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/tegumentar/:petId", authMiddleware, sistemaTegumentaController.getSistemaTegumentar);
router.get("/tegumentarP/:petId", authMiddleware, sistemaTegumentaController.getSistemaTegumentarP);
router.get("/tegumentarPet/:id", authMiddleware, sistemaTegumentaController.getSistemaTegumentarId);
router.post("/tegumentar", authMiddleware, sistemaTegumentaController.createSistemaTegumentar);
router.put("/tegumentar/:id", authMiddleware, sistemaTegumentaController.updateSistemaTegumentar);
router.delete("/tegumentar/:id", authMiddleware, sistemaTegumentaController.delSistemaTegumentar);

module.exports = router;
