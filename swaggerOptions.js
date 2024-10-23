// swaggerOptions.js
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Usuarios",
            version: "1.0.0",
            description: "Documentación de la API de Usuarios con Swagger",
        },
        servers: [
            {
                url: "http://localhost:5000", // Cambia el puerto si es necesario
                description: "Servidor local"
            }
        ],
    },
    apis: ["./src/routers/*.js"], // Ajusta la ruta si es necesario
};

export default swaggerOptions;
