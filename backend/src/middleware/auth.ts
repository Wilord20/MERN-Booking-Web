import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

declare global { // Extender la interfaz Request de Express
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"]; // Obtener el token de las cookies
    if(!token) {
        return res.status(401).json({ message: "No autorizado" });
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string); // Verificar el token
        req.userId = (decoded as JwtPayload).userId; // Guardar el ID del usuario en la solicitud
        next();
    } catch (error) {
        return res.status(401).json({ message: "No autorizado" });
    };
};

export default verifyToken;