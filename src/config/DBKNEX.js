import oracledb from 'oracledb';
import knex from 'knex';
import { knexFile } from './DB.js';

// Inicializar el cliente de Oracle según el sistema operativo
if (process.platform === 'win32') {
    oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_19_12' });
} else if (process.platform === 'darwin') {
    oracledb.initOracleClient({ libDir: process.env.HOME + '/Downloads/instantclient_19_8' });
}

// Configurar knex
const knexDb = knex(knexFile.development);

// Función para probar la conexión
const testConnection = async () => {
    try {
        // Hacer una consulta simple a la base de datos para verificar la conexión
        const result = await knexDb.raw('SELECT 1 FROM DUAL');
        console.log('Conexión exitosa:', result);
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    } finally {
        // Cerrar la conexión de Knex
        await knexDb.destroy();
    }
};

// Ejecutar la prueba de conexión
testConnection();
