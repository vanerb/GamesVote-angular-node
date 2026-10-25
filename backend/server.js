import 'dotenv/config';
import express from "express";
import cors from "cors";
import sequelize from "./models/index.js";
import "./models/Assotiations.js";

import checkRoutes from "./routes/checkRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import igdbRoutes from "./routes/igdbRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import valorationRoutes from "./routes/valorationRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
    'http://localhost:4200',
    'https://vanerb.github.io'
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas
app.use("/api/check", checkRoutes);
app.use("/api/igdb", igdbRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/valoration", valorationRoutes);
app.use("/api/images", imageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


sequelize.sync({ alter: true })
    .then(() => {
        console.log("Base de datos sincronizada");

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Servidor iniciado en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al sincronizar la base de datos:", error);
    });

