import {SessionStrategy} from "./strategy/SessionStrategy";
import {UserService} from "../user/UserService";
import {inject, injectable} from "tsyringe";
import {AxiosResponse, HttpStatusCode} from 'axios';
import {GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH, USERS_MS_URI} from "../../../utils/config"
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {ExternalServiceInternalError} from "../errors/ExternalServiceInternalError";
import {ExternalServiceConnectionError} from "../errors/ExternalServiceConnectionError";
import {InvalidExternalServiceResponseError} from "../errors/InvalidExternalServiceResponseError";
import {HttpRequester} from "../../../api/external/HttpRequester";

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
        const id = await this.getUserIdFromUserEmail(email);
        return this.strategy.logIn(id, password, this.userService);
    }

    public async logInFederated(email: string){
        const id = await this.getUserIdFromUserEmail(email);
        return this.strategy.logInFederated(id, this.userService);
    }

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

    private getIdFromRequestResponse = (response: void | AxiosResponse<any, any>): string => {
       return response?.data;
    }

    private getUserIdFromUserEmail = async (email: string): Promise<string> => {
        const getUserIdFromUserEmailEndpointUrl = USERS_MS_URI + GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH;

        const id = await this.httpRequester.getToUrl(getUserIdFromUserEmailEndpointUrl, {params: {email: email}},
            this.handleRequestError, this.getIdFromRequestResponse);
        if(!id) throw new InvalidExternalServiceResponseError("Invalid external service response.");

        return id;
    }
}