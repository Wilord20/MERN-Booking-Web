import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// -api/users/register
router.post(
  "/register",
  [
    check("firstName", "El nombre es requerido").isString(),
    check("lastName", "El apellido es requerido").isString(),
    check("email", "El email es requerido").isEmail(),
    check("password", "La contraseña debe ser mayor a 6 carácteres").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      user = new User(req.body);
      await user.save();

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

      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Algo salió mal" });
    }
  }
);

export default router;
