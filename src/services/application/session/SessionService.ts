import {SessionStrategy} from "./strategy/SessionStrategy";
import {TokenSessionStrategy} from "./strategy/TokenSessionStrategy";
import {UserService} from "../user/UserService";

export class SessionService{
    private strategy: SessionStrategy;
    private readonly service: UserService;

    constructor(strategy: SessionStrategy) {
        this.service = new UserService();
        this.strategy = strategy;
    }

    /**
     * Delegates user login to the authentication strategy.
     * @param userData - The user data.
     * @returns A promise that resolves with the result of the login operation.
     * @throws {Error} If any of the parameters inside userData is empty.
     */
    public login = async (userData: any) => {
        return this.strategy.logIn(userData, this.service);
    }
}

export const sessionService = new SessionService(new TokenSessionStrategy())