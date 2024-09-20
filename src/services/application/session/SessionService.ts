import {SessionStrategy} from "./strategy/SessionStrategy";
import {TokenSessionStrategy} from "./strategy/TokenSessionStrategy";
import {UserService} from "../user/UserService";

export class SessionService{
    private strategy: SessionStrategy;
    private readonly userService: UserService;

    constructor(strategy: SessionStrategy) {
        this.userService = new UserService();
        this.strategy = strategy;
    }

    /**
     * Delegates user login to the authentication strategy.
     * @returns A promise that resolves with the result of the login operation.
     * @throws {Error} If any of the parameters inside userData is empty.
     * @param email
     * @param password
     */
    public login = async (email: string, password: string) => {
        return this.strategy.logIn(email, password, this.userService);
    }
}

export const sessionService = new SessionService(new TokenSessionStrategy())