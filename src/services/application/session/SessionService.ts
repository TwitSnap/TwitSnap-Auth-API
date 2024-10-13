import {SessionStrategy} from "./strategy/SessionStrategy";
import {UserService} from "../user/UserService";
import {inject, injectable} from "tsyringe";
import {AxiosResponse, HttpStatusCode} from 'axios';
import {GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH, JWT_SECRET, USERS_MS_URI} from "../../../utils/config"
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {ExternalServiceInternalError} from "../errors/ExternalServiceInternalError";
import {ExternalServiceConnectionError} from "../errors/ExternalServiceConnectionError";
import {InvalidExternalServiceResponseError} from "../errors/InvalidExternalServiceResponseError";
import {HttpRequester} from "../../../api/external/HttpRequester";
import {logger} from "../../../utils/container/container";
import * as jwt from "jsonwebtoken";
@injectable()
export class SessionService{
    private strategy: SessionStrategy;
    private readonly userService: UserService;
    private httpRequester: HttpRequester;

    constructor(@inject("SessionStrategy") strategy: SessionStrategy, userService: UserService, httpRequester: HttpRequester) {
        this.userService = userService;
        this.strategy = strategy;
        this.httpRequester = httpRequester;
    }

    /**
     * Delegates user login to the authentication strategy.
     * @returns A promise that resolves with the result of the login operation.
     * @throws {Error} If any of the parameters inside userData is empty.
     */
    public logIn = async (email: string, password: string): Promise<string> => {
        logger.logDebugFromEntity(`Attempting to logIn user with email: ${email}`, this.constructor);

        const id = await this.getUserIdFromUserEmail(email);
        const token = this.strategy.logIn(id, password, this.userService);

        logger.logDebugFromEntity(`Attempt to logIn user with email ${email} was successful.`, this.constructor);
        return token;
    }

    /**
     * Logs in a federated user (e.g., with OAuth or external provider).
     * @param {string} email - The email of the federated user trying to log in.
     * @returns {Promise<string>} A promise that resolves with the federated user session token or ID.
     */
    public async logInFederated(email: string): Promise<string>{
        const id = await this.getUserIdFromUserEmail(email);
        return this.strategy.logInFederated(id, this.userService);
    }
    /**
     * Decrypts user token and returns id.
     * @param {string} token - The token of the given user.
     * @returns {string} A string of the id saved in the token.
     */
    public decryptToken = (token:string): string => {
        console.log(token);
        const decoded = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
        const {userId} = decoded;

        return userId;
    }

    /**
     * Handles errors related to the external HTTP request.
     * @param {any} e - The error object from the failed request.
     * @throws {InvalidCredentialsError} If the request returned a 404 status, indicating invalid credentials.
     * @throws {ExternalServiceInternalError} If the request returned any other status, indicating an internal error in the external service.
     * @throws {ExternalServiceConnectionError} If there was a connection issue with the external service.
     */

    private handleRequestError = (e: any): void => {
        if(e.response){
            switch (e.response.status) {
                case HttpStatusCode.NotFound:
                    throw new InvalidCredentialsError("Invalid credentials.");
                default:
                    throw new ExternalServiceInternalError("An external service has had an internal error.");
            }
        } else if(e.request){
            throw new ExternalServiceInternalError("Timeout while waiting for an external service.");
        } else {
            throw new ExternalServiceConnectionError("Error while connecting to an external service.")
        }
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
     * Retrieves the user ID from an external service based on the user's email.
     * @param {string} email - The email of the user.
     * @returns {Promise<string>} A promise that resolves with the user ID.
     * @throws {InvalidExternalServiceResponseError} If the external service response is invalid.
     */
    private getUserIdFromUserEmail = async (email: string): Promise<string> => {
        const getUserIdFromUserEmailEndpointUrl = USERS_MS_URI + GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH;

        const id = await this.httpRequester.getToUrl(getUserIdFromUserEmailEndpointUrl, {params: {email: email}},
            this.handleRequestError, this.getIdFromRequestResponse);
        if(!id) throw new InvalidExternalServiceResponseError("Invalid external service response.");

        return id;
    }
}