"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies["auth_token"]; // Obtener el token de las cookies
    if (!token) {
        return res.status(401).json({ message: "No autorizado" });
    }
    ;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY); // Verificar el token
        req.userId = decoded.userId; // Guardar el ID del usuario en la solicitud
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "No autorizado" });
    }
    ;
};
exports.default = verifyToken;
