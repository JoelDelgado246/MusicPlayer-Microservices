import { queryDB } from "../config/db.js";

// Función para buscar un usuario por email
export const findUserByEmail = async (email) => {
    const users = await queryDB(
        "SELECT * FROM Usuarios WHERE email = @email",
        { email }
    );
    return users.length ? users[0] : null;
};

// Función para crear un usuario
export const createUser = async (nombre, email, contraseña) => {
    await queryDB(
        "INSERT INTO Usuarios (nombre, email, contraseña) VALUES (@nombre, @email, @contraseña)",
        { nombre, email, contraseña }
    );
};

// Función para buscar un usuario por ID
export const findUserById = async (id) => {
    const users = await queryDB(
        "SELECT id, nombre, email FROM Usuarios WHERE id = @id",
        { id }
    );
    return users.length ? users[0] : null;
};
