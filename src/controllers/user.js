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

const getUserEmail = async (correo) => {
    try {
        const user = await db("usuarios").where("Correo", correo).first() // Usa first() para obtener un único registro
        return user; // Retorna el usuario o null si no existe
        console.log("usuario", user)
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Error fetching user by email');
    }
};



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

const getUserRol = async (Correo) => {
    try {
        const users = await db("usuarios as u")
            .join("rolesUser as r", "u.idRol", "r.idRol")
            .select("*")
            .where("u.Correo", Correo);

        return users;

    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Error fetching user');
    }


}

const getUser = async () => {
    try {
        const roles = await db("rolesUser").select("*")
        return roles;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Error fetching user');
    }
}

// Controlador de usuarios
// Controlador de usuarios
const getUsuarios = async (page, limit) => {
    try {
        const offset = (page - 1) * limit; // Calcular el desplazamiento

        const [users, totalCount] = await Promise.all([
            db("usuarios as u")
                .select({
                    idUsuarios: "u.idUsuarios",
                    nombre: "u.nombre",
                    apellido: "u.apellido",
                    correo: "u.Correo",
                    nombreRol: "r.nombreRol",
                    estado: "u.estado",
                })
                .join("rolesUser as r", "u.idRol", "r.idRol")
                .limit(limit) // Aplicar límite
                .offset(offset), // Aplicar desplazamiento

            // Contar el total de registros
            db("usuarios as u").count('* as total').first()
        ]);

        return { users, total: totalCount.total };
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Error fetching user');
    }
};


export { getAllUsers, getUserById, getUserEmail, UserSession, getUserRol, getUser, getUsuarios };
