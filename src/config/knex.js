import oracledb from 'oracledb';
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Knex con Oracle
const db = knex({
    client: 'oracledb',
    connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECTION_STRING
    },
    pool: { min: 0, max: 7 } // Puedes ajustar el tamaño del pool según tu necesidad
});

async function connectToOracle() {
    try {
        // Realizar una consulta simple para verificar la conexión
        const result = await db.raw('SELECT 1 FROM DUAL');

        console.log('Conexión exitosa a Oracle!', result);
        return 'Conexión exitosa a Oracle!';
    } catch (err) {
        console.error('Error en la conexión a Oracle:', err.message);
        return 'Error en la conexión a Oracle';
    } finally {
        await db.destroy(); // Cierra la conexión cuando terminas
    }
}

connectToOracle();
