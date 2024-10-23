import { db } from '../config/DB.js';
import { registerValidations } from '../schema/validations/registerUser.js';
import { validationRol } from '../schema/validations/registerRol.js';
import { SALT_ROUNT } from '../config.js';
import bcrypt from 'bcrypt'
import { getUserEmail } from './user.js'

const registerUser = async (nombre, apellido, Correo, Contrasena, estado) => {

    const passwordHash = await bcrypt.hash(Contrasena, SALT_ROUNT)

    try {
        const [userId] = await db('usuarios').insert({
            nombre: nombre,
            apellido: apellido,
            Correo: Correo,
            Contrasena: passwordHash,
            estado: estado,
        }).returning('idUsuarios');

        return userId; // Retorna el ID del nuevo usuario
    } catch (error) {
        console.error('Error registering user:', error);
        throw new Error('Error registering user');

    }

};

const registerRole = async (data) => {
    const result = validationRol.safeParse(data); // Cambié a sin await ya que safeParse no es una promesa
    if (!result.success) {
        const errors = result.error.flatten();
        throw new Error(JSON.stringify(errors.fieldErrors));
    }
    try {
        const [rolUser] = await db('rolesUser').insert({
            nombreRol: data.nombreRol,
            idUsuarios: data.idUsuarios
        }).returning('idRol')
        return rolUser; // Retorna el ID del nuevo rol de usuario
    } catch (error) {
        console.error('Error registering role:', error);
        throw new Error('Error registering role');
    }

}
export { registerUser, registerRole };
