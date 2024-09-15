import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";

const router = express.Router();

const storage = multer.memoryStorage(); // Almacenamiento en memoria
const upload = multer({
  storage: storage, // Usar el almacenamiento en memoria
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar el tamaño de los archivos a 5MB
});

// --api/my-hotels
router.post(
  "/",
  upload.array("imageFiles", 6), // Subir hasta 6 archivos desde un campo del formulario llamado imageFiles
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[]; // Obtener los archivos subidos
      const newHotel = req.body; // Obtener los datos del hotel

      // Subir las imagenes a Cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64"); // Convertir la imagen a base64 para que pueda ser enviada a Cloudinary
        let dataURI = "data:" + image.mimetype + ";base64," + b64; // Crear la URL de la imagen
        const response = await cloudinary.v2.uploader.upload(dataURI); // Subir la imagen a Cloudinary

        return response.url; // Devolver la URL de la imagen
      });

      const imageUrls = await Promise.all(uploadPromises); // Esperar a que todas las imagenes sean subidas

      // Si la subida fue exitosa, adjuntar las URLs de las imagenes al hotel
      
      // Guardar los datos del hotel en la base de datos
      // Responder con un estatus 201
    } catch (error) {
      console.log("Error al crear el hotal:", error);
      res.status(500).json({ message: "Error al crear el hotel" });
    }
  }
);
