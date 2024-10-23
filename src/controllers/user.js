import { db } from '../config/DB.js';

// Obtener todos los usuarios
const getAllUsers = async () => {
    try {
        const users = await db('usuarios').select('*');
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Error fetching users');
    }
};

// Obtener un usuario por ID
const getUserById = async (id) => {
    try {
        const user = await db('usuarios').where({ idUsuarios: id }).first();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Error fetching user');
    }
};

const getUserEmail = async (Correo) => {
    try {
        const user = await db('usuarios').where({ Correo: Correo }).first();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Error fetching user');
    }
}


// select "nombre", "apellido", "Correo" from "usuarios"
// where "Correo"='juan.perez@example.com' and  "Contrasena"='password123' 

const UserSession = async (Correo, Contrasena) => {
    try {
        const user = await db('usuarios').select('nombre', 'apellido', 'Correo', 'Contrasena')
            .where({ Correo: Correo, Contrasena: Contrasena }).first();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Error fetching user');
    }

}
export { getAllUsers, getUserById, getUserEmail, UserSession };
