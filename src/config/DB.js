import oracledb from 'oracledb';
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Knex con Oracle
export const db = knex({
    client: 'oracledb',
    connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECTION_STRING
    },
    pool: { min: 0, max: 7 } // Puedes ajustar el tamaño del pool según tu necesidad
});



