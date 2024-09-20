import {SessionStrategy} from "./SessionStrategy";
import {UserService} from "../../user/UserService";

export class TokenSessionStrategy implements SessionStrategy {
    //TODO
    logIn(email: string, password: string, userService: UserService): Promise<string> {
        throw new Error("Method not implemented.");
    }
}