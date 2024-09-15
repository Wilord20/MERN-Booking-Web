import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({ // Configuración de Cloudinary
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret
});

mongoose.connect(process.env.MONGO_DB_CONNEX as string)
  /*
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });
*/

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Habilitar las credenciales para que el frontend pueda enviar cookies
  })
); // Habilitar CORS para que el frontend pueda hacer peticiones

app.use(express.static(path.join(__dirname, "../../frontend/dist"))); // Servir los archivos estáticos de la carpeta dist 

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
