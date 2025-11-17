const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Image = require("../models/Image");
const User = require("../models/User");
const Valoration = require("../models/Valoration.js");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({storage});


router.post("/", authMiddleware, upload.single("valorationImage"), async (req, res) => {
    try {
        const {description, value, gameId} = req.body;

        const valoration = await Valoration.create({
            description,
            value,
            gameId,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: req.user.id
        })

        if (req.file) {
            await Image.create({
                url: req.file.path,
                from: "valoration",
                fromId: valoration.id
            });
        }

        const reserveWithImages = await Valoration.findByPk(valoration.id, {
            include: [
                {model: Image, where: {from: "valoration"}, required: false}
            ]
        });

        res.json(reserveWithImages);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

//UPDATE
router.put("/:id", authMiddleware, upload.single("valorationImage"), async (req, res) => {
    try {
        const { description, value, gameId} = req.body;

        const valoration = await Valoration.findByPk(req.params.id);
        if (!valoration) return res.status(404).json({error: "Reserva no encontrada"});

        await valoration.update({
            description,
            value,
            gameId,
            createdAt: valoration.createdAt,
            updatedAt: new Date(),
            userId: req.user.id
        })

        if (req.file) {
            await Image.destroy({where: {fromId: valoration.id, from: "valoration"}});

            await Image.create({
                url: req.file.path,
                from: "valoration",
                fromId: valoration.id
            });
        }

        const reserveWithImages = await Valoration.findByPk(valoration.id, {
            include: [
                {model: Image, where: {from: "reserve"}, required: false}
            ]
        });

        res.json(reserveWithImages);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})


router.get("/", async (req, res) => {
    try {
        const valorations = await Valoration.findAll({
            include: [
                {
                    model: User, // 👈 incluye el usuario completo
                    attributes: ["email"],
                    include: [
                        {
                            model: Image,
                            where: { from: "user" }, // 👈 imagen del usuario
                            required: false
                        }
                    ]
                },
                {
                    model: Image,
                    where: {from: "valoration"},
                    required: false
                }
            ]
        })
        res.json(valorations);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.get("/getAllValorationsByGameId/:id", authMiddleware, async (req, res) => {
    try {
        const gameId = req.params.id;


        const valorations = await Valoration.findAll({
            where: { gameId: gameId },
            include: [
                {
                    model: User,
                    include: [
                        {
                            model: Image,
                            where: { from: "user" },
                            required: false
                        }
                    ]
                },
                {
                    model: Image,
                    where: {from: "valoration"},
                    required: false
                }
            ]
        });
        res.json(valorations);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});


router.get("/getMyValorationsByGameId/:id", authMiddleware, async (req, res) => {
    try {
        const gameId = req.params.id;
        const userId = req.user.id;

        const valorations = await Valoration.findAll({
            where: { userId: userId, gameId: gameId },
            include: [
                {
                    model: User,
                    attributes: ["email"],
                    include: [
                        {
                            model: Image,
                            where: { from: "user" },
                            required: false
                        }
                    ]
                },
                {
                    model: Image,
                    where: {from: "valoration"},
                    required: false
                }
            ]
        });
        res.json(valorations);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//getValorationByIdAndByGameId

router.get("/getValorationByIdAndByGameId/:id/:gameId", authMiddleware, async (req, res) => {
    try {
        const gameId = req.params.gameId;
        const valorationId = req.params.id;

        const valorations = await Valoration.findOne({
            where: {
                id: valorationId,
                gameId: gameId
            },
            include: [
                {
                    model: User,
                    attributes: ["email"],
                    include: [
                        {
                            model: Image,
                            where: { from: "user" },
                            required: false
                        }
                    ]
                },
                {
                    model: Image,
                    where: {from: "valoration"},
                    required: false
                }
            ]
        });
        res.json(valorations);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});


router.get("/:id", async (req, res) => {
    try {
        const valoration = await Valoration.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ["email"],
                    include: [
                        {
                            model: Image,
                            where: { from: "user" }, // 👈 imagen del usuario
                            required: false
                        }
                    ]
                },
                {
                    model: Image,
                    where: {from: "valoration"},
                    required: false
                }
            ]
        })
        res.json(valoration);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const valoration = await Valoration.findByPk(req.params.id);

        if (!valoration) {
            return res.status(404).json({ error: "Valoration not found" });
        }

        await valoration.destroy();
        res.json({ message: "Valoration deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;