import User from "../models/User.js";

// Buscar un usuario por email
export const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

// Crear un usuario sin `creado_en`
export const createUser = async (nombre, email, contraseña) => {
    return await User.create({
        nombre,
        email,
        contraseña
    });
};

// Buscar un usuario por ID
export const findUserById = async (id) => {
    return await User.findByPk(id, { attributes: { exclude: ["contraseña"] } });
};
