import express from 'express';
import { PORT } from './config.js'
import { router } from './routers/router.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from '../swaggerOptions.js'; // Archivo de configuración
// Generar la especificación de Swagger usando swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);


const app = express();
app.use(express.json())
app.use(router)
// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`corriendo en el puerto ${PORT}`);
});
