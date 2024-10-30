import { db } from '../config/DB.js';
import { registerValidations } from '../schema/validations/registerUser.js';
import { validationRol } from '../schema/validations/registerRol.js';
import { SALT_ROUNT } from '../config.js';
import bcrypt from 'bcrypt'
import { getUserEmail } from './user.js'

const registerUser = async (nombre, apellido, Correo, Contrasena, estado, idRol) => {
    try {
        const passworhash = await bcrypt.hash(Contrasena, SALT_ROUNT)
        const [userId] = await db('usuarios').insert({
            nombre: nombre,
            apellido: apellido,
            Correo: Correo,
            Contrasena: passworhash, // Asegúrate de que esto sea el hash
            estado: estado,
            idRol: idRol,
        }).returning('idUsuarios'); // Verifica que el nombre de la columna sea correcto

        return userId; // Retorna el ID del nuevo usuario
    } catch (error) {
        console.error('Error registering user:', error);
        throw new Error('Error registering user: ' + error.message); // Proporcionar información adicional sobre el error
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
        console.error('Error registering user:', error);
        throw new Error('Error registering user: ' + error.message);

    }

}
export { registerUser, registerRole };
