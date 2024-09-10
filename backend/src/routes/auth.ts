import { check, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verify } from "crypto";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "El email es requerido").isEmail(),
    check("password", "La contraseña es requerida").isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Credenciales inválidas" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Credenciales inválidas" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Algo salió mal" });
    }
  }
);

router.get("/validate-token", verifyToken, async (req: Request, res: Response) => { // Ruta para validar el token a través de un middleware llamado verifyToken
  res.status(200).send({ userId: req.userId });
});

router.post("/logout", async (req: Request, res: Response) => { // Rura para invalidar el token
  res.cookie("auth_token", "", {
    expires: new Date(0), // Establecer la fecha de expiración a una fecha pasada
  });
  res.send();
});

export default router;