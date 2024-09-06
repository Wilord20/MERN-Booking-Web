import express, { Request, Response } from "express";
import User from "../models/user";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({
        email: req.body.email
    });

    if (user) {
        return res.status(400).json({ message: "El usuario ya existe" });
    }

    user = new User(req.body);
    await user.save();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Algo salió mal" });
  }
});
