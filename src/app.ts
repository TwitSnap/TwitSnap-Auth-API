import "reflect-metadata";
import express from "express";
import router from "./api/routes/routes";
import cors from 'cors';
import {errorMiddleware} from "./api/errors/handling/ErrorHandler";
import {databaseConnector} from "./utils/container/container";
import {logger} from "./utils/container/container";
import {AUTH_PROVIDER_X509_CERT_URL, AUTH_URI, CLIENT_EMAIL, CLIENT_ID, CLIENT_X509_CERT_URL, PORT, PRIVATE_KEY, PRIVATE_KEY_ID, PROJECT_ID, TOKEN_URI, TYPE, UNIVERSE_DOMAIN} from "./utils/config";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from './utils/swagger/docs/swaggerDocs.json';
import {PassportAuthService} from "./services/application/session/PassportAuthService";

export var admin = require("firebase-admin");

const app = express();
const passport = PassportAuthService.getPassport();

const settingsCert = {
        type: TYPE,
        project_id: PROJECT_ID,
        private_key_id: PRIVATE_KEY_ID,
        private_key: PRIVATE_KEY,
        client_email: CLIENT_EMAIL,
        client_id: CLIENT_ID,
        auth_uri:AUTH_URI,
        token_uri: TOKEN_URI,
        auth_provider_x509_cert_url: AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: CLIENT_X509_CERT_URL,
        universe_domain: UNIVERSE_DOMAIN
}
admin.initializeApp({
    credential: admin.credential.cert(settingsCert)
})

app.use(cors());
app.use(express.json());
app.use(router)
app.use(errorMiddleware);
app.use(passport.initialize());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

databaseConnector.initializeConnection().then(() => {
    app.listen(PORT, () => {
        logger.logInfo(`Server is running on port ${PORT}`);
    });
});