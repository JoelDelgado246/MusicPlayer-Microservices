import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Registro de usuario
export const registerUser = async (req, res) => {

    const { nombre, email, contraseña } = req.body;

    if (!nombre || !email || !contraseña) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const newUser = await createUser(nombre, email, hashedPassword);

        res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
        console.error("❌ Error en registerUser:", error.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// Inicio de sesión
export const loginUser = async (req, res) => {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "mi_clave_secreta", {
            expiresIn: "1h"
        });

        console.log(process.env.JWT_SECRET)

        res.status(200).json({ message: "Login exitoso",user: { id: user.id, email: user.email, nombre: user.nombre}, token});
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
};

export const verifyToken = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ error: "No token provided" });
  
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_JWT_KEY);
  
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) return res.status(404).json({ error: "User not found" });
  
      res.status(200).json({ id: user._id, username: user.user });
    } catch (error) {
      console.error("Error verifying token:", error.message);
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };


