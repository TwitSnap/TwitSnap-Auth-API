import {SessionStrategy} from "./strategy/SessionStrategy";
import {UserService} from "../user/UserService";
import {inject, injectable} from "tsyringe";
import {JWT_SECRET} from "../../../utils/config"
import {logger} from "../../../utils/container/container";
import * as jwt from "jsonwebtoken";
import {TwitSnapAPIs} from "../../../api/external/TwitSnapAPIs";
@injectable()
export class SessionService{
    private strategy: SessionStrategy;
    private readonly userService: UserService;
    private twitSnapAPIs: TwitSnapAPIs;

    constructor(@inject("SessionStrategy") strategy: SessionStrategy, userService: UserService, twitSnapAPIs: TwitSnapAPIs) {
        this.userService = userService;
        this.strategy = strategy;
        this.twitSnapAPIs = twitSnapAPIs;
    }

    /**
     * Delegates user login to the authentication strategy.
     * @returns A promise that resolves with the result of the login operation.
     * @throws {Error} If any of the parameters inside userData is empty.
     */
    public logIn = async (email: string, password: string): Promise<string> => {
        logger.logDebugFromEntity(`Attempting to logIn user with email: ${email}`, this.constructor);

        const id = await this.twitSnapAPIs.getUserIdFromUserEmail(email);
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
        const id = await this.twitSnapAPIs.getUserIdFromUserEmail(email);
        return this.strategy.logInFederated(id, this.userService);
    }

    //TODO Quitar
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
}