import "reflect-metadata";
import express from "express";
import router from "./api/routes/routes";
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import {errorMiddleware} from "./api/errors/handling/ErrorHandler";
import {databaseConnector} from "./utils/container/container";
import {logger} from "./utils/container/container";
import {PORT} from "./utils/config";

const app = express();
app.use(cors({origin: "*"}));
app.use(express.json());
app.use(router)
app.use(errorMiddleware);

//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

databaseConnector.initializeConnection().then(() => {
    app.listen(PORT, () => {
        logger.logInfo(`Server is running on port ${PORT}`);
        console.log(`Server is running on port ${PORT}`);
    });
});

//3. Terminar logIn
//3.2 Login identidad federada
//3.5. Implementar authenticate

//1. Arreglar variables de entorno faltantes y definir las que no estan en el archivo .env
//2. Crear un archivo .env.example
//6. Mejorar el logger para que tenga distintos logLevels
//9.5 Acomodar swagger

//10. Agregar tests