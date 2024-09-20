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