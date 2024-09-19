import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes/routes"
import {AppDataSource} from "./repository/database"
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from "../src/utils/swagger_output.json";

import { Pool } from "pg";

dotenv.config();

var cors = require('cors')
const corsOptions = {
  origin:"*" // Whitelist the domains you want to allow
};
const app = express();
app.use(cors(corsOptions))
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/",router)
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.send("hi");
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(process.env.PORT, () => {
      console.log("Server is running on http://localhost:" + process.env.PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));