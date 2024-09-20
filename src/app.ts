import "reflect-metadata";
import express from "express";
import router from "./api/routes/routes";
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from "../src/utils/swagger_output.json";
import cors from 'cors';
import {errorMiddleware} from "./api/errors/handling/ErrorHandler";
import databaseConnector from "./db/connectors/DatabaseConnector";
import logger from "./utilss/logger/Logger";
import {PORT} from "./utilss/config";

const app = express();
app.use(cors({origin: "*"}));
app.use(express.json());
app.use(router)
app.use(errorMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

databaseConnector.initializeConnection().then(() => {
    app.listen(PORT, () => {
        logger.logInfo(`Server is running on port ${PORT}`);
        console.log(`Server is running on port ${PORT}`);
    });
});

//1. Arreglar variables de entorno faltantes y definir las que no estan en el archivo .env
//2. Crear un archivo .env.example
//3. Terminar logIn
//4. Terminar controller
//5. Conectar controller con Routes
//6. Mejorar el logger para que tenga distintos logLevels
//7. Agregar errores custom
//8. Usar dependency injection
//9. Terminar repository
//10. Agregar tests