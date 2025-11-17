const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Image = require("../models/Image");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleWare");
const Valoration = require("../models/Valoration");


const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // carpeta donde se guardan las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });


router.post("/register", upload.single("profileImage"), async (req, res) => {
    try {
        const { name, cognames, tlf, email, type, password } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ error: "El usuario ya existe" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, cognames, tlf, email, type, password: hashedPassword });

        let profileImage = null;
        if (req.file) {
            profileImage = await Image.create({
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


        res.json({ message: "Usuario registrado", userWithProfile });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user.id, email: user.email }, "secretkey");

        user.update({
            token: token,

        })



        res.json({ message: "Login exitoso", access_token:token, type: user.type });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.get("/user", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findOne({
            where: { id: userId },
            include: [
                {
                    model: Image,
                    where: { from: "user" },
                    required: false
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;