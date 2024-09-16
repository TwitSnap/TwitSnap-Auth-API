import { SessionStrategy } from "./strategy/sessionStrategy";
import { TokenSessionStrategy } from "./strategy/tokenSessionStrategy";
import { userService } from "./userService";

export class SessionService{
    private strategy: SessionStrategy;
    private service: userService;

    constructor(strategy: SessionStrategy) {
        this.service = new userService();
        this.strategy = strategy;
    }

    /**
     * Delegates user registration to the authentication strategy.
     * @param userData - The user data.
     * @throws {Error} If any of the parameters (name, email, password, city) inside userData are empty or are no strings.
     */
    public register = async (userData: any) => {
        return await this.strategy.register(userData, this.service);
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