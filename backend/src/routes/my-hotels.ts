import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { HotelType } from "../shared/types";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage(); // Almacenamiento en memoria
const upload = multer({
  storage: storage, // Usar el almacenamiento en memoria
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar el tamaño de los archivos a 5MB
});

// --api/my-hotels
router.post(
  "/",
  verifyToken, // Verificar el token del usuario
  [
    // Validar los datos del hotel
    body("name").notEmpty().withMessage("Nombre es requerido"),
    body("city").notEmpty().withMessage("Ciudad es requerida"),
    body("counrtry").notEmpty().withMessage("El país es requerido"),
    body("desciption").notEmpty().withMessage("La descripción es requerida"),
    body("type").notEmpty().withMessage("Tipo es requerido"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Precio es requerido"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Las instalaciones son requeridas"),
  ],
  upload.array("imageFiles", 6), // Subir hasta 6 archivos desde un campo del formulario llamado imageFiles
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[]; // Obtener los archivos subidos
      const newHotel: HotelType = req.body; // Obtener los datos del hotel

      // Subir las imagenes a Cloudinary
      const imageUrls = await uploadImagesToCloudinary(imageFiles); // Esperar a que todas las imagenes sean subidas

      // Si la subida fue exitosa, adjuntar las URLs de las imagenes al hotel
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      // Guardar los datos del hotel en la base de datos
      const hotel = new Hotel(newHotel);
      await hotel.save();

      // Responder con un estatus 201
      res.status(201).send(hotel);
    } catch (error) {
      console.log("Error al crear el hotal:", error);
      res.status(500).json({ message: "Error al crear el hotel" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId }); // Buscar los hoteles del usuario
    res.json(hotels); // Responder con los hoteles encontrados
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los hoteles" });
  }
});

// --api/my-hotels/:id
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString(); // Obtener el ID del hotel
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el hotel" });
  }
});

// --api/my-hotels/:id
router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel no encontrado" });
      };

      const files = req.files as Express.Multer.File[]; // Obtener los archivos subidos

      const updatedImageUrls = await uploadImagesToCloudinary(files); // Subir las imagenes a Cloudinary

      hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])]; // Adjuntar las URLs de las imagenes al hotel

      await hotel.save(); // Guardar los datos del hotel en la base de datos
      res.status(201).send(hotel); // Responder con un estatus 201
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el hotel" });
    }
  }
);

async function uploadImagesToCloudinary(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64"); // Convertir la imagen a base64 para que pueda ser enviada a Cloudinary
    let dataURI = "data:" + image.mimetype + ";base64," + b64; // Crear la URL de la imagen
    const response = await cloudinary.v2.uploader.upload(dataURI); // Subir la imagen a Cloudinary
    
    return response.url; // Devolver la URL de la imagen
  });
  
  const imageUrls = await Promise.all(uploadPromises); // Esperar a que todas las imagenes sean subidas
  return imageUrls;
}

export default router;
