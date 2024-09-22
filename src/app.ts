import "reflect-metadata";
import express from "express";
import router from "./api/routes/routes";
import cors from 'cors';
import {errorMiddleware} from "./api/errors/handling/ErrorHandler";
import {databaseConnector} from "./utils/container/container";
import {logger} from "./utils/container/container";
import {PORT} from "./utils/config";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from './utils/swagger/docs/swaggerDocs.json';
import passport  from "passport";

import passportStrategy from './utils/config';

const app = express();


app.use(cors());
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
//0. Testear lo hecho hasta ahora desde Postman
//1. Terminar logIn con y sin identidad federada
//2. Implementar authenticate usando Passport
//3. Testear lo hecho desde Postman
//4. Agregar tests unitarios