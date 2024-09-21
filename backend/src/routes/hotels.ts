import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";

const router = express.Router();

// /api/hotels/seach?
router.get("/search", async (req: Request, res: Response) => {
  try {
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1" // Si no se envia el query param page, se asigna 1
    );
    const skip = (pageNumber - 1) * pageSize; // Cuantos registros se van a saltar

    const hotels = await Hotel.find().skip(skip).limit(pageSize); // Se saltan los registros y se limita la cantidad de registros a traer

    const total = await Hotel.countDocuments(); // Cuenta la cantidad de documentos en la coleccion
    
    const response: HotelSearchResponse = {
        data: hotels,
        pagination: {
            total,
            page: pageNumber,
            pages: Math.ceil(total / pageSize)
        }
    }

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;