import {SessionStrategy} from "./strategy/SessionStrategy";
import {UserService} from "../user/UserService";
import {inject, injectable} from "tsyringe";
import {logger} from "../../../utils/container/container";
import {TwitSnapAPIs} from "../../../api/external/TwitSnapAPIs";
import { Encrypter } from "../../../utils/encrypter/Encrypter";
import {UserIsBannedError} from "../errors/UserIsBannedError";

@injectable()
export class SessionService{
    private strategy: SessionStrategy;
    private readonly userService: UserService;
    private twitSnapAPIs: TwitSnapAPIs;
    private encrypter: Encrypter;

    constructor(@inject("SessionStrategy") strategy: SessionStrategy, userService: UserService, twitSnapAPIs: TwitSnapAPIs,@inject("Encrypter") encrypter: Encrypter) {
        this.userService = userService;
        this.strategy = strategy;
        this.twitSnapAPIs = twitSnapAPIs;
        this.encrypter = encrypter;
    }

    /**
     * Delegates user login to the authentication strategy.
     * @returns A promise that resolves with the result of the login operation.
     * @throws {Error} If any of the parameters inside userData is empty or user is banned.
     */
    public logIn = async (email: string, password: string): Promise<string> => {
        logger.logDebugFromEntity(`Attempting to logIn user with email: ${email}`, this.constructor);

        const userData = await this.twitSnapAPIs.getUserDataFromUserEmail(email);

        const token = this.strategy.logIn(userData.uid, password, this.userService);
        if(userData.isBanned) throw new UserIsBannedError("User with email " + email + " is banned.");

        logger.logDebugFromEntity(`Attempt to logIn user with email ${email} was successful.`, this.constructor);
        return token;
    }

    /**
     * Logs in a federated user (e.g., with OAuth or external provider).
     * @param {string} token - El token de inicio de sesion con google.
     * @returns {Promise<string>} A promise that resolves with the federated user session token or ID.
     */
    public async logInFederated(token: string): Promise<string>{
        const id = await this.twitSnapAPIs.getUserIdFromFirebaseToken(token);
        const user = await this.userService.getUserById(id.uid);
        if(id.isBanned) throw new UserIsBannedError("User is banned");
        if (user){
            return this.strategy.logInFederated(id.uid);
        }
        else{
            await this.userService.register(id.uid,this.encrypter.encryptString(id.uid))
            return this.strategy.logInFederated(id.uid);
        }
    }
}