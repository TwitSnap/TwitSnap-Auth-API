import {SessionStrategy} from "./strategy/SessionStrategy";
import {UserService} from "../user/UserService";
import {inject, injectable} from "tsyringe";
import axios, {HttpStatusCode} from 'axios';
import { NoUserFoundsError } from "../errors/NoUserFoundError";
import {GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH, USERS_MS_URI} from "../../../utils/config"

@injectable()
export class SessionService{
    private strategy: SessionStrategy;
    private readonly userService: UserService;

    constructor(@inject("SessionStrategy") strategy: SessionStrategy, userService: UserService) {
        this.userService = userService;
        this.strategy = strategy;
    }

    /**
     * Delegates user login to the authentication strategy.
     * @returns A promise that resolves with the result of the login operation.
     * @throws {Error} If any of the parameters inside userData is empty.
     */
    public logIn = async (email: string, password: string): Promise<string> => {
        const apiUrl = USERS_MS_URI + GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH;

        //TODO Hacer errores custom y modularizar
        const response = await axios.get(apiUrl, {params: {email:email}})
            .catch(e => this.handleRequestError(e));

        const id = response?.data;
        if(!id) throw Error("fdskojgdsf"); //TODO Hacer un error custom de que no se recibio el ID.

        return this.strategy.logIn(id, password, this.userService);
    }

    private handleRequestError = (e: any): void => {
        if(e.response){
            switch (e.response.status) {
                case HttpStatusCode.NotFound:
                    throw Error();
                    // * InvalidCredentialsError
                default:
                    throw Error("cfxsdf");
                    // * ExternalServiceInternalError
            }
        } else if(e.request){
            // * ExternalServiceInternalError por timeout
            throw Error("dfsxcsdzf")
        } else {
            // * ExternalServiceConnectionError
            throw Error("dsfsdfbghn")
        }
    }


    public async logInFederated(email: string){
        const id = await axios.get("https://twitsnap-user-api.onrender.com/api/v1/users/id", { params:{email:email},})
            .catch(e => {throw new NoUserFoundsError("No se encontro ningun user")});

        return this.strategy.logInFederated(id.data, this.userService);
    }
}