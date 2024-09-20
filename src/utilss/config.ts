import dotenv from 'dotenv';
import { Helpers } from "./helpers";

dotenv.config();
Helpers.validateEnvVars();

// ? Server config
export const PORT = process.env.PORT;
export const LOG_ROUTE = process.env.LOG_ROUTE;
export const LOGGING = process.env.LOGGING;

// ? Database config
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_SYNCHRONIZE = process.env.DB_SYNCHRONIZE;
export const DB_LOGGING = process.env.DB_LOGGING;
export const MIGRATIONS_PATH = process.env.MIGRATIONS_PATH;
export const DB_TYPE = process.env.DB_TYPE;