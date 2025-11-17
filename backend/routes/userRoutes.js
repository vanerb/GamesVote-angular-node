const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Image = require("../models/Image");
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

router.post("/", upload.single("profileImage"), async (req, res) => {
    try {
        const user = await User.create(req.body);

        let profileImage = null;
        if (req.file) {
             await Image.create({
                url: req.file.path,
                from: "user",
                fromId: user.id
            });
        }

        const userWithProfile = await User.findByPk(user.id, {
            include: [
                { model: Image, where: { from: "user" }, required: false }
            ]
        });

        res.json(userWithProfile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/", upload.single("profileImage"), authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        await user.update({
            name: req.body.name,
            cognames: req.body.cognames,
            tlf: req.body.tlf,
        });

        if(req.body.password){
            const hashedPassword = await bcrypt.hash( req.body.password, 10);
            await user.update({
                name: req.body.name,
                cognames: req.body.cognames,
                password: hashedPassword,
            });
        }

        if (req.file) {
            await Image.destroy({ where: { fromId: user.id, from: "user" } });

            await Image.create({
                url: req.file.path,
                from: "user",
                fromId: user.id
            });
        }

        const updatedUser = await User.findByPk(user.id, {
            include: [
                { model: Image, where: { from: "user" }, required: false }
            ]
        });

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Image,
                    where: { from: "user" },
                    required: false
                }
            ]
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error interno" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [
                {
                    model: Image,
                    where: { from: "user" },
                    required: false
                }
            ]
        });

        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
