const express = require("express");
const IgdbService = require("../services/igdbService");
const router = express.Router();

const igdbService = new IgdbService();
igdbService.init().catch(err => console.error("Error inicializando IGDB:", err));

router.get("/getAllGames", async (req, res) => {
    try {
        const { search, filters: filtersStr, limit = 10, page = 1 } = req.query;

        const numericLimit = parseInt(limit);
        const numericPage = parseInt(page);
        const offset = (numericPage - 1) * numericLimit;

        let filters = {};
        if (filtersStr) {
            try {
                filters = JSON.parse(filtersStr);
            } catch (err) {
                console.warn("No se pudo parsear filters, usando objeto vacío");
            }
        }

        const games = await igdbService.getGames(
            search || "",
            filters,
            numericLimit,
            offset
        );

        res.json(games);
    } catch (err) {
        console.error("Error en getAllGames:", err);
        res.status(500).json({ error: err.message || "Error en IGDB API" });
    }
})

router.get("/getGameById/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const games = await igdbService.getGameById(
            id
        );

        res.json(games);
    } catch (err) {
        console.error("Error en getAllGames:", err);
        res.status(500).json({ error: err.message || "Error en IGDB API" });
    }
})




router.get("/getAllPlatforms", async (req, res) => {
    try {


        const platforms = await igdbService.getPlatforms();

        res.json(platforms);
    } catch (err) {
        console.error("Error en getAllGames:", err);
        res.status(500).json({ error: err.message || "Error en IGDB API" });
    }
})


module.exports = router;