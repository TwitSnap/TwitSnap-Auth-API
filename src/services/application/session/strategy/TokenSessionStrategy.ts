import {SessionStrategy} from "./SessionStrategy";
import {UserService} from "../../user/UserService";

export class TokenSessionStrategy implements SessionStrategy {
    /**
     * @inheritDoc
     */
    logIn = async (email: string, password: string, userService: UserService): Promise<string> => {
        throw new Error("Method not implemented.");
    }
}