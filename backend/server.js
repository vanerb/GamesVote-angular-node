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

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/check", checkRoutes);
app.use("/api/igdb", igdbRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/valoration", valorationRoutes);
app.use("/api/images", imageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

sequelize.sync({ alter: true }).then(() => {
    console.log("Base de datos sincronizada");
    app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
});
