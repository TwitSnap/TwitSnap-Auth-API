import {HttpRequester} from "./HttpRequester";
import {GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH, USERS_MS_URI, NOTIFICATIONS_MS_URI, SEND_NOTIFICATION_ENDPOINT_PATH} from "../../utils/config";
import {InvalidExternalServiceResponseError} from "../../services/application/errors/InvalidExternalServiceResponseError";
import {AxiosResponse, HttpStatusCode} from "axios";
import {InvalidCredentialsError} from "../../services/application/errors/InvalidCredentialsError";
import {ExternalServiceInternalError} from "../../services/application/errors/ExternalServiceInternalError";
import {ExternalServiceConnectionError} from "../../services/application/errors/ExternalServiceConnectionError";
import {logger} from "../../utils/container/container";
import {ExternalServiceHTTPError} from "./ExternalServiceHTTPError";
import {injectable} from "tsyringe";

const RESET_PASSWORD_EVENT_TYPE = "reset-password";

@injectable()
export class TwitSnapAPIs{
    httpRequester: HttpRequester;

    constructor(httpRequester: HttpRequester){
        this.httpRequester = httpRequester;
    }

    /**
     * Retrieves user data from an external service based on the user's email.
     * @param {string} email - The email of the user.
     * @returns {Promise<{ uid?: string; isBanned?: boolean }>} A promise that resolves with the user data, including the user's ID (`uid`) and ban status (`isBanned`).
     * @throws {InvalidExternalServiceResponseError} If the external service response is invalid or missing required fields.
     */
    public getUserDataFromUserEmail = async (email: string): Promise<{ uid: string; isBanned: boolean }> => {
        const getUserIdFromUserEmailEndpointUrl = USERS_MS_URI + GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH;

        const data = await this.httpRequester.getToUrl(getUserIdFromUserEmailEndpointUrl, {params: {email: email}},
            this.getUserDataFromUserEmailErrorHandler, this.getUserDataFromUserEmailExtractor);

        if(data.isBanned === undefined) throw new InvalidExternalServiceResponseError("Invalid external service response. isBanned field is missing.");
        if(data.uid === undefined) throw new InvalidExternalServiceResponseError("Invalid external service response. uid field is missing.");

        return data as { uid: string; isBanned: boolean }; // ? Como ya chequeamos anteriormente que los campos estan, podemos castear con seguridad.
    }

    /**
     * Extracts user data from the HTTP response.
     * @param {void | AxiosResponse<any, any>} response - The HTTP response containing the user data.
     * @returns {{ uid?: string; isBanned?: boolean }} An object containing the user's ID (`uid`) and ban status (`isBanned`). Fields may be undefined if not present in the response.
     */
    private getUserDataFromUserEmailExtractor = (response: void | AxiosResponse<any, any>): { uid?: string; isBanned?: boolean } => {
        return {
            uid: response?.data.uid,
            isBanned: response?.data.is_banned,
        }
    }

    /**
     * Only for operation: getUserDataFromUserEmailErrorHandler
     *
     * Handles errors related to the external HTTP request.
     * @param {any} e - The error object from the failed request.
     * @throws {InvalidCredentialsError} If the request returned a 404 status, indicating invalid credentials.
     * @throws {ExternalServiceInternalError} If the request returned any other status, indicating an internal error in the external service.
     * @throws {ExternalServiceConnectionError} If there was a connection issue with the external service.
     */
    private getUserDataFromUserEmailErrorHandler = (e: any): void => {
        this.standardErrorHandler(e, this.getUserDataFromUserEmailResponseStatusErrorHandler);
    }

    /**
     * Only for operation: getUserDataFromUserEmailErrorHandler
     *
     * Generates an error based on the response status for getting the user ID from user email.
     *
     * @param {number} status - The HTTP status code.
     * @returns {Error} The generated error object.
     */
    private getUserDataFromUserEmailResponseStatusErrorHandler = (status: number): Error => {
        switch (status) {
                case HttpStatusCode.NotFound:
                    return new InvalidCredentialsError("Invalid credentials."); //TODO Revisar si este error es correcto o tendriamos que tirar otro
                default:
                    return new ExternalServiceInternalError("An external service has had an internal error.");
            }
    }

    /**
     * Sends a reset password notification to the user.
     * @param {string[]} destinations - The email addresses to send the notification to.
     * @param {string} token - The reset password token.
     * @throws {ExternalServiceHTTPError} If the external service returns an unexpected status code.
     */

    public sendResetPasswordNotification = async (destinations: string[], token: string): Promise<void> => {
        const url = NOTIFICATIONS_MS_URI + SEND_NOTIFICATION_ENDPOINT_PATH;

        const data = {
            type: RESET_PASSWORD_EVENT_TYPE,
            params: {
                token: token
            },
            notifications: {
                type: "email",
                destinations: destinations,
                sender: "grupo8memo2@gmail.com"
            }
        }

        const errorHandler = this.sendResetPasswordNotificationErrorHandler;

        await this.httpRequester.postToUrl(url, data, errorHandler);
    }


    /**
     * Only for operation: sendResetPasswordNotificationErrorHandler
     *
     * Handles errors related to the external HTTP request.
     * @param {any} e - The error object from the failed request.
     * @throws {ExternalServiceHTTPError} If the request returned an unexpected status code.
     */
    private sendResetPasswordNotificationErrorHandler = (e: any): void => {
        this.standardErrorHandler(e, this.sendResetPasswordNotificationResponseStatusErrorHandler);
    }


    /**
     * Only for operation: sendResetPasswordNotificationErrorHandler
     *
     * Generates an error based on the response status for sending the reset password notification.
     *
     * @param {number} status - The HTTP status code.
     * @returns {Error} The generated error object.
     */
    private sendResetPasswordNotificationResponseStatusErrorHandler = (status: number): Error => {
        switch (status) {
            default:
                return new ExternalServiceHTTPError(`sendResetPasswordNotification API Call has failed with status ${status}.`);
        }
    }


    /**
     *
     * Generates an error based on the response status for sending the reset password notification.
     *
     * @param {token} string - Firebase Token of the user.
     * @returns {Error} The generated error object.
     */
    public getUserIdFromFirebaseToken = async (token:string): Promise< { uid: string; isBanned: boolean }> =>{
        const url = USERS_MS_URI + "/api/v1/register/google"
        const data = {token:token}
        const user = await this.httpRequester.postToUrl(url,data,this.getUserIdFromFirebaseErrorHandler,{} ,this.getUserIdFromUserResponseExtractor)
        logger.logInfo("El id recibido es: " + user);
        if (!user) throw new InvalidExternalServiceResponseError("Invalid external service response.")
        if(user.uid == undefined) throw new InvalidExternalServiceResponseError("Invalid external service response.");
        if (user.isBanned == undefined) throw new InvalidExternalServiceResponseError("Invalid external service response.");
        return user as { uid: string; isBanned: boolean };
    }

    private getUserIdFromUserResponseExtractor = (response: void | AxiosResponse<any, any>):  { uid?: string; isBanned?: boolean } => {
        return {
            uid: response?.data.uid,
            isBanned: response?.data.is_banned,
        }
     }

        /**
     * Only for operation: getUserIdFromFirebaseToken
     *
     * Handles errors related to the external HTTP request.
     * @param {any} e - The error object from the failed request.
     * @throws {InvalidCredentialsError} If the request returned a 404 status, indicating invalid credentials.
     * @throws {ExternalServiceInternalError} If the request returned any other status, indicating an internal error in the external service.
     * @throws {ExternalServiceConnectionError} If there was a connection issue with the external service.
     */
        private getUserIdFromFirebaseErrorHandler = (e: any): void => {
            this.standardErrorHandler(e, this.getUserDataFromUserEmailResponseStatusErrorHandler);
        }
    /**
     * Handles errors related to the external HTTP request.
     * @param {any} e - The error object from the failed request.
     * @param {(status: number) => Error} responseStatusErrorHandler - The error handler for the response status.
     * @throws {Error} The generated error object.
     */
    private standardErrorHandler = (e: any, responseStatusErrorHandler: (status: number) => Error): void => {
        let error;

        if(e.response){
            error = responseStatusErrorHandler(e.response.status);
        } else if(e.request){
            error = new ExternalServiceInternalError("Timeout while waiting for an external service.");
        } else {
            error = new ExternalServiceConnectionError("Error while connecting to an external service.")
        }

        logger.logErrorFromEntity(("Caught error: " + e.message), this.constructor);
        logger.logErrorFromEntity(("Throwing error: " + error.message), this.constructor);

        throw error;
    }
}