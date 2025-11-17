const express = require("express");
const router = express.Router();
const multer = require("multer");
const Image = require("../models/Image");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Subir foto de perfil
router.post("/profile", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        const image = await Image.create({
            url: req.file.path,
            from: "user",
            userId: req.user.id
        });
        res.json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        // 1️⃣ Buscar el usuario autenticado
        const user = await User.findByPk(req.user.id, {
            include: [
                {
                    model: Image,
                    where: { from: "user" },
                    required: false // si el usuario puede no tener imagen
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // 2️⃣ Retornar la información del usuario con su imagen (si existe)
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.Images?.[0] || null
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/profile/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            include: [
                {
                    model: Image,
                    where: { from: "user" },
                    required: false
                }
            ]
        });

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.Images?.[0] || null
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
