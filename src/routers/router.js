import express from 'express';
import { registerUser, registerRole } from '../controllers/insert.js'; // Ajusta la ruta según tu estructura de carpetas
import { getAllUsers, getUserById, getUserEmail, UserSession, getUserRol, getUser, getUsuarios } from '../controllers/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SALT_ROUNT, KEY_VERIFICATION } from '../config.js'
import { ValidationSession } from '../schema/validations/SessionUser.js';
import { registerValidations } from '../schema/validations/registerUser.js';
const router = express.Router();

// router.js

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - Correo
 *         - Contrasena
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del usuario
 *         apellido:
 *           type: string
 *           description: El apellido del usuario
 *         Correo:
 *           type: string
 *           description: El correo electrónico del usuario
 *         Contrasena:
 *           type: string
 *           description: La contraseña del usuario, debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial
 *         estado:
 *           type: string
 *           description: El estado del usuario, opcional
 *       example:
 *         nombre: Juan
 *         apellido: Pérez
 *         Correo: juan.perez@example.com
 *         Contrasena: Password123!
 *         estado: activo
 */

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del usuario registrado
 *                 token:
 *                   type: string
 *                   description: Token JWT generado
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *       400:
 *         description: Error en la validación de los datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   description: Descripción del error de validación
 *       409:
 *         description: El correo ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de conflicto, el correo ya está registrado
 *       500:
 *         description: Error interno del servidor
 */

router.post('/api/usuarios', async (req, res) => {
    const { nombre, apellido, Correo, Contrasena, estado, idRol } = req.body;
    const result = registerValidations.safeParse(req.body);

    // Validación de datos
    if (!result.success) {
        const errors = result.error.flatten();
        return res.status(400).json({ error: errors.fieldErrors });
    }

    console.group('datos', nombre, apellido, Correo, Contrasena, idRol);

    try {
        // Verificar si el correo ya está registrado
        const EmailExiste = await getUserEmail(Correo);
        console.log('Email existe:', EmailExiste);

        if (EmailExiste) {
            return res.status(409).json({ code: 409, error: 'Correo electrónico ya está registrado.' });
        }

        // Generar el token de verificación
        const token = await jwt.sign({ nombre, apellido, Correo }, KEY_VERIFICATION, { expiresIn: '5h' });

        // Registrar al usuario
        const userId = await registerUser(nombre, apellido, Correo, Contrasena, estado, idRol);
        console.log('Usuario registrado:', userId);

        return res.status(201).json({ id: userId, token, message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API para manejar roles de usuarios
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Asignar un rol a un usuario
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreRol:
 *                 type: string
 *                 description: Nombre del rol a asignar
 *                 example: "Administrador"
 *               idUsuarios:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de IDs de usuarios a los que se les asignará el rol
 *                 example: ["6234abcdefg", "7345hijkl"]
 *     responses:
 *       201:
 *         description: Rol asignado a usuario correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID del rol asignado
 *                   example: "6234abcdefg"
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito
 *                   example: "Rol Asignado a usuario Correctamente"
 *       400:
 *         description: Error al asignar el rol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Detalles del error..."
 */
router.post('/api/roles', async (req, res) => {
    const userData = req.body;
    try {
        const roles = await registerRole(userData)
        return res.status(201).json({ id: roles, message: 'Rol Asignado a usuario Correctamente' })

    } catch (error) {
        const parseError = JSON.parse(error.message);
        console.error("Error: ", parseError);
        return res.status(400).json({ error: parseError }); // Enviar errores de validación
    }
})

router.post('/api/session', async (req, res) => {
    const { Correo, Contrasena } = req.body; // Extraer variables directamente

    // Validar los datos de entrada
    const result = ValidationSession.safeParse(req.body); // safeParse no necesita await
    if (!result.success) {
        const errors = result.error.flatten();
        return res.status(400).json({ error: errors.fieldErrors }); // Devolver los errores de validación
    }

    try {
        // Verificar si el correo existe en la base de datos
        const user = await getUserEmail(Correo);
        console.log(user), "biendo";
        if (!user) {
            return res.status(401).json({ error: 'Correo electrónico no encontrado' });
        }

        // Comparar la contraseña
        const validPassword = await bcrypt.compare(Contrasena, user.Contrasena);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const getData = await getUserRol(Correo)


        const dataResponse = getData.map((item) => {
            return {
                id: item.idUsuarios,
                nombre: item.nombre,
                apellido: item.apellido,
                correo: item.Correo,
                estado: item.estado,
                rol: item.nombreRol,

            }
        })

        // Generar el token JWT
        const token = await jwt.sign({ userData: user.Correo }, KEY_VERIFICATION, { expiresIn: '5h' });

        // Devolver la respuesta de éxito
        return res.status(200).json({ token, data: dataResponse, message: 'Sesión iniciada correctamente.' });
    } catch (error) {
        console.error('Error:', error); // Mejor manejo de errores en consola
        return res.status(500).json({ error: 'Ocurrió un error en el servidor' }); // Devolver error del servidor
    }
});


router.get('/api/usuarios', async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Error fetching users' });
    }
});

// Ruta para obtener un usuario por ID
router.get('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Error fetching user' });
    }
});
// Exportar el router


router.get('/api/user/roles', async (req, res) => {
    try {
        const roles = await getUser();
        return res.status(200).json({ status: 'success', data: roles, message: 'roles obtenidos', code: 200 });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return res.status(500).json({ error: 'Error fetching roles' });
    }
})
// Ruta para obtener usuarios con paginación
// Ruta para obtener usuarios con paginación
router.get('/get', async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1); // Asegurarse de que sea al menos 1
    const limit = Math.max(parseInt(req.query.limit) || 10, 1); // Asegurarse de que sea al menos 1

    try {
        const { users, total } = await getUsuarios(page, limit);
        const totalPages = Math.ceil(total / limit); // Calcular el número total de páginas

        return res.status(200).json({
            users: users,
            total: total,
            totalPages: totalPages,
            message: 'Datos obtenidos correctamente',
            status: 'success'
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Error fetching user' });
    }
});


export { router };
