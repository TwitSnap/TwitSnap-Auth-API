import dotenv from 'dotenv';
import { Helpers } from "./helpers";

dotenv.config();

const requiredEnvVars = [
    'PORT', 'DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME', "JWT_SECRET",
    'DB_SYNCHRONIZE', 'DB_LOGGING', 'DB_TYPE', "LOG_ROUTE", "LOGGING",
    "LOG_ERROR", "LOG_DEBUG", "LOG_INFO", "JWT_EXPIRATION_TIME", "USERS_MS_URI",
    "GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH", "JWT_NEW_PASSWORD", "JWT_NEW_PASSWORD_EXPIRATION_TIME",
    "NOTIFICATIONS_MS_URI", "SEND_NOTIFICATION_ENDPOINT_PATH", "API_KEY"
];

Helpers.validateEnvVarsList(requiredEnvVars);

// ? Server config
export const PORT = process.env.PORT;
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_NEW_PASSWORD = process.env.JWT_NEW_PASSWORD;
export const JWT_NEW_PASSWORD_EXPIRATION_TIME = process.env.JWT_NEW_PASSWORD_EXPIRATION_TIME;
export const API_KEY = process.env.API_KEY as string;

// ? Logger config
export const LOG_ROUTE = process.env.LOG_ROUTE;
export const LOGGING = process.env.LOGGING;
export const LOG_ERROR = process.env.LOG_ERROR;
export const LOG_DEBUG = process.env.LOG_DEBUG;
export const LOG_INFO = process.env.LOG_INFO;

// ? Database config
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const DB_SYNCHRONIZE = process.env.DB_SYNCHRONIZE;
export const DB_LOGGING = process.env.DB_LOGGING;
export const DB_TYPE = process.env.DB_TYPE;
export const CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// ? Other microservices info
export const USERS_MS_URI = process.env.USERS_MS_URI as string;
export const GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH = process.env.GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH as string;
export const NOTIFICATIONS_MS_URI = process.env.NOTIFICATIONS_MS_URI as string;
export const SEND_NOTIFICATION_ENDPOINT_PATH = process.env.SEND_NOTIFICATION_ENDPOINT_PATH as string;

export const TYPE = process.env.TYPE;
export const PROJECT_ID = process.env.PROJECT_ID;
export const PRIVATE_KEY_ID = process.env.PRIVATE_KEY_ID;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
export const CLIENT_ID = process.env.CLIENT_ID;
export const AUTH_URI = process.env.AUTH_URI;
export const TOKEN_URI = process.env.TOKEN_URI;
export const AUTH_PROVIDER_X509_CERT_URL = process.env.AUTH_PROVIDER_X509_CERT_URL;
export const CLIENT_X509_CERT_URL = process.env.CLIENT_X509_CERT_URL;
export const UNIVERSE_DOMAIN = process.env.UNIVERSE_DOMAIN;

