import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserByEmail, createUser } from "../repositories/userRepository.js";

dotenv.config();

// Registro de usuario
export const registerUser = async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);
        await createUser(nombre, email, hashedPassword);

        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("Error en registerUser:", error.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// Inicio de sesión
export const loginUser = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        res.status(200).json({ token, user: { id: user.id, email: user.email, nombre: user.nombre } });
    } catch (error) {
        console.error("Error en loginUser:", error.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
};
