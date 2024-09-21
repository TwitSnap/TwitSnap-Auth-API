import "reflect-metadata";
import express from "express";
import router from "./api/routes/routes";
import cors from 'cors';
import {errorMiddleware} from "./api/errors/handling/ErrorHandler";
import {databaseConnector} from "./utils/container/container";
import {logger} from "./utils/container/container";
import {PORT} from "./utils/config";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from './utils/swagger/swagger_output.json';

const app = express();

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(router)
app.use(errorMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

databaseConnector.initializeConnection().then(() => {
    app.listen(PORT, () => {
        logger.logInfo(`Server is running on port ${PORT}`);
    });
});

//TODO:
//3.1. Documentar

//4. Terminar logIn
//5. Login identidad federada
//6. Implementar authenticate con Passport

//10. Agregar tests