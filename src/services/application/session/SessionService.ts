import {SessionStrategy} from "./strategy/SessionStrategy";
import {UserService} from "../user/UserService";
import {inject, injectable} from "tsyringe";
import axios, { HttpStatusCode } from 'axios';
import { NoUserFoundsError } from "../errors/NoUserFoundError";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError";

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
        //1. Obtener el id del usuario haciendo una api call al microservicio de usuarios
        try{
            const id = await axios.get("https://twitsnap-user-api.onrender.com/api/v1/users/id",
                {
                    params:{email:email},
                }
            ).catch(e=> {throw new NoUserFoundsError("No se encontro ningun user")})
            if (id.status != HttpStatusCode.Ok){
                throw new NoUserFoundsError("No se encontro ningun user");
            }
            return this.strategy.logIn(id.data, password, this.userService);
        }
        catch(e ){
            throw new NoUserFoundsError("No se encontro ningun usuario");
        }

    }

    public async logInFederated(email:string){
        try{
            const id = await axios.get("https://twitsnap-user-api.onrender.com/api/v1/users/id",
                {
                    params:{email:email},
                }
            ).catch(e=> {throw new NoUserFoundsError("No se encontro ningun user")})
            if (id.status != HttpStatusCode.Ok){
                throw new NoUserFoundsError("No se encontro ningun user");
            }
            return this.strategy.logInFederated(id.data, this.userService);
        }
        catch(e ){
            throw new NoUserFoundsError("No se encontro ningun usuario");
        }
    }
}