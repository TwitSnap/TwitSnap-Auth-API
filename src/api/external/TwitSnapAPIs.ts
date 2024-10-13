import {HttpRequester} from "./HttpRequester";
import {GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH, USERS_MS_URI} from "../../utils/config";
import {InvalidExternalServiceResponseError} from "../../services/application/errors/InvalidExternalServiceResponseError";
import {AxiosResponse, HttpStatusCode} from "axios";
import {InvalidCredentialsError} from "../../services/application/errors/InvalidCredentialsError";
import {ExternalServiceInternalError} from "../../services/application/errors/ExternalServiceInternalError";
import {ExternalServiceConnectionError} from "../../services/application/errors/ExternalServiceConnectionError";
import {logger} from "../../utils/container/container";

export class TwitSnapAPIs{
    httpRequester: HttpRequester;

    constructor(httpRequester: HttpRequester){
        this.httpRequester = httpRequester;
    }

        /**
     * Retrieves the user ID from an external service based on the user's email.
     * @param {string} email - The email of the user.
     * @returns {Promise<string>} A promise that resolves with the user ID.
     * @throws {InvalidExternalServiceResponseError} If the external service response is invalid.
     */
    public getUserIdFromUserEmail = async (email: string): Promise<string> => {
        const getUserIdFromUserEmailEndpointUrl = USERS_MS_URI + GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH;

        const id = await this.httpRequester.getToUrl(getUserIdFromUserEmailEndpointUrl, {params: {email: email}},
            this.handleRequestError, this.getIdFromRequestResponse);
        if(!id) throw new InvalidExternalServiceResponseError("Invalid external service response.");

        return id;
    }

    /**
     * Extracts the user ID from the HTTP response.
     * @param {void | AxiosResponse<any, any>} response - The HTTP response containing the user data.
     * @returns {string} The user ID extracted from the response.
     */
    private getIdFromRequestResponse = (response: void | AxiosResponse<any, any>): string => {
       return response?.data;
    }

    /**
     * Handles errors related to the external HTTP request.
     * @param {any} e - The error object from the failed request.
     * @throws {InvalidCredentialsError} If the request returned a 404 status, indicating invalid credentials.
     * @throws {ExternalServiceInternalError} If the request returned any other status, indicating an internal error in the external service.
     * @throws {ExternalServiceConnectionError} If there was a connection issue with the external service.
     */
    private handleRequestError = (e: any): void => {
        let error;

        if(e.response){
            switch (e.response.status) {
                case HttpStatusCode.NotFound:
                    error = new InvalidCredentialsError("Invalid credentials.");
                    break;
                default:
                    error = new ExternalServiceInternalError("An external service has had an internal error.");
            }
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