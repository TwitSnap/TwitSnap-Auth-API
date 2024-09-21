import {SessionStrategy} from "./strategy/SessionStrategy";
import {UserService} from "../user/UserService";
import {inject, injectable} from "tsyringe";

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
     * @param email
     * @param password
     */
    public login = async (email: string, password: string): Promise<string> => {
        return this.strategy.logIn(email, password, this.userService);
    }
}