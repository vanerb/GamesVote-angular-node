const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
    res.json({ message: "Servicio Activo y funcionando" });
})

module.exports = router;