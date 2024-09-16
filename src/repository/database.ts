
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import Auth from "../models/auth.entity"

dotenv.config();


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_CONTAINER,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "bank",
  
    synchronize: process.env.NODE_ENV === "dev" ? true : true,
  //logging logs sql command on the treminal
    logging: process.env.NODE_ENV === "dev" ? false : false,
    entities: [Auth],
    subscribers: [],
  });
