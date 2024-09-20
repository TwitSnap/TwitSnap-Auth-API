import {SessionStrategy} from "./SessionStrategy";

export class TokenSessionStrategy implements SessionStrategy {
    //TODO
    logIn(logInData: any, userService: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
}