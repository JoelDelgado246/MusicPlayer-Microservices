import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "../repositories/userRepository.js";
import dotenv from "dotenv";

dotenv.config();

// Registro de usuario
export const registerUser = async (req, res) => {
    console.log("📌 Datos recibidos en registerUser:", req.body);

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

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        res.status(200).json({ user: { id: user.id, email: user.email, nombre: user.nombre } });
    } catch (error) {
        console.error("Error en loginUser:", error.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
};
